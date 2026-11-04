import { NextResponse } from 'next/server';
// Wenits hype radar — GeckoTerminal Solana trending pools, paginated.
// GET /api/coins?page=1 — 10 items per page, unlimited pages (scroll to fetch more).
// Memory cache per page (2 min). Moon score from 24h change + volume/liq frenzy.
const PER_PAGE = 10;
const mem = new Map<string, { v: any; exp: number }>();
const logoMem = new Map<string, { v: string | null; exp: number }>();
async function tokenLogo(tokenAddr: string): Promise<string | null> {
 const hit = logoMem.get(tokenAddr);
 if (hit && Date.now() < hit.exp) return hit.v;
 try {
  const r = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddr}`);
  if (!r.ok) throw new Error('tok');
  const j: any = await r.json();
  const img = j.data?.attributes?.image_url || null;
  logoMem.set(tokenAddr, { v: img, exp: Date.now() + 3600000 });
  return img;
 } catch { logoMem.set(tokenAddr, { v: null, exp: Date.now() + 600000 }); return null; }
}
// SPEC v0.2: gate + skor via _lib/gate.ts (Safety Gate -> Moon Score v2).
import { safetyGate, moonScoreV2, poolAgeHours } from '../_lib/gate';
function moonScore(ch24: number, vol: number, liq: number) {
 let s = 50 + ch24 * 1.8 + Math.min((vol / Math.max(liq, 1)) * 3, 24) - Math.min(Math.abs(ch24) * .45, 16);
 s = Math.max(2, Math.min(99, Math.round(s)));
 return { score: s, verdict: s >= 75 ? 'MOON LIKELY' : s >= 58 ? 'WATCH' : s >= 40 ? 'COOLING' : 'AVOID / HIGH RISK' };
}
const COLORS = ['#ff4d9d', '#ff8a00', '#c8ff3e', '#38e6ff', '#8b5bff', '#9945FF', '#2e6bff', '#ff5b5b', '#00e5a0', '#ffb800'];
export async function GET(req: Request) {
 const u = new URL(req.url);
 const page = Math.max(1, parseInt(u.searchParams.get('page') || '1', 10) || 1);
 const key = 'hype:' + page;
 const hit = mem.get(key);
 if (hit && Date.now() < hit.exp) return NextResponse.json({ ...hit.v, cached: true });
 try {
  // GeckoTerminal trending = 20 pools/page. Fetch enough GT pages to fill our page.
  const gtPage = Math.ceil((page * PER_PAGE) / 20) || 1;
  const r = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/trending_pools?page=${gtPage}`, { next: { revalidate: 60 } });
  if (!r.ok) throw new Error('GT_' + r.status);
  const j: any = await r.json();
  // token logos: per-token endpoint (trending list carries no images)
  const rawPools = (j.data || []).map((p: any) => {
   const a = p.attributes || {};
   const baseId = p.relationships?.base_token?.data?.id || '';
   return { a, baseAddr: (baseId.split('_')[1] || '') };
  }).filter((x: any) => x.a && parseFloat(x.a.base_token_price_usd || 0) > 0);
  const startInGt = ((page - 1) * PER_PAGE) % 20;
  const windowPools = rawPools.slice(startInGt, startInGt + PER_PAGE);
  const logos: (string | null)[] = [];
  for (let i = 0; i < windowPools.length; i += 3) {
   const chunk = windowPools.slice(i, i + 3);
   const got = await Promise.all(chunk.map((x: any) => x.baseAddr ? tokenLogo(x.baseAddr) : Promise.resolve(null)));
   logos.push(...got);
  }
  const seenSym = new Set<string>();
  const all = windowPools.map((x: any, i: number) => {
   const a = x.a;
   const price = parseFloat(a.base_token_price_usd || 0);
   const ch24 = parseFloat(a.price_change_percentage?.h24 || 0);
   const ch6 = parseFloat(a.price_change_percentage?.h6 || 0);
   const ch1 = parseFloat(a.price_change_percentage?.h1 || 0);
   const vol = parseFloat(a.volume_usd?.h24 || 0);
   const liq = parseFloat(a.reserve_in_usd || 0);
   const name: string = a.name || '';
   const base = name.split('/')[0].trim();
   const sym = base.toUpperCase().slice(0, 12) || '???';
   const ageH = poolAgeHours(a.pool_created_at);
   const dup = seenSym.has(sym); seenSym.add(sym);
   const gate = safetyGate({ price, liq, vol24h: vol, ch24, poolAgeH: ageH, seenDup: dup });
   if (gate.status === 'REJECT') return null; // disembunyikan (AC1)
   const { score, verdict } = moonScoreV2({ ch24, ch6, ch1, vol, liq, poolAgeH: ageH, risky: gate.status === 'RISKY', newDegen: gate.newDegen });
   return {
    id: a.address, sym, name: base,
    price, change24h: ch24, change6h: ch6, change1h: ch1, volume24h: vol, liquidity: liq,
    poolAgeH: ageH, dex: (a.dex_id || '').toLowerCase() || 'dex',
    pairUrl: 'https://www.geckoterminal.com/solana/pools/' + a.address,
    image: logos[i] || null, poolAddress: a.address, tokenAddress: (x.baseAddr || '') || null,
    moon: score, verdict, status: gate.status, riskReason: gate.reasons, newDegen: gate.newDegen,
    color: COLORS[(page * PER_PAGE + i) % COLORS.length],
   };
  }).filter(Boolean);
  const coins = all;
  // prefetch next GT page in background when crossing boundary (fire-and-forget)
  const out = {
   updatedAt: new Date().toISOString(), source: 'wenits-internal/geckoterminal-trending',
   page, perPage: PER_PAGE, coins,
   hasMore: coins.length === PER_PAGE,
  };
  mem.set(key, { v: out, exp: Date.now() + 120000 });
  return NextResponse.json({ ...out, cached: false });
 } catch (e: any) {
  return NextResponse.json({ error: 'MARKET_FAILED' }, { status: 502 });
 }
}
