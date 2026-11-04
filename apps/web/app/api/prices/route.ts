import { NextResponse } from 'next/server';
// Wenits price resolver for position PnL.
// Input: mints (comma-separated pool addresses). Output: map mint -> { price, sym, name, image, source }.
// 1) radar pages (poolAddress or id match) 2) DexScreener on-demand. 60s cache.
const mem = new Map<string, { v: any; exp: number }>();
const TTL = 60000;
type Row = { price: number; sym: string; name: string; image: string | null; source: string };
async function fromDex(pool: string): Promise<Row | null> {
 const hit = mem.get(pool);
 if (hit && Date.now() < hit.exp) return hit.v;
 try {
  const r = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${encodeURIComponent(pool)}`, { signal: AbortSignal.timeout(10000) });
  if (!r.ok) { mem.set(pool, { v: null, exp: Date.now() + 30000 }); return null; }
  const j: any = await r.json();
  const pair = (j.pairs || [])[0] || j.pair;
  if (!pair?.priceUsd) { mem.set(pool, { v: null, exp: Date.now() + 30000 }); return null; }
  const base = pair.baseToken || {};
  const row: Row = {
   price: parseFloat(pair.priceUsd),
   sym: String(base.symbol || pool.slice(0, 4)).slice(0, 10),
   name: String(base.name || base.symbol || '').slice(0, 24),
   image: base.icon || base.logoURI || null,
   source: 'dexscreener',
  };
  mem.set(pool, { v: row, exp: Date.now() + TTL });
  return row;
 } catch { mem.set(pool, { v: null, exp: Date.now() + 30000 }); return null; }
}
export async function GET(req: Request) {
 const u = new URL(req.url);
 const mints = (u.searchParams.get('mints') || '').split(',').map(s => s.trim()).filter(s => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s)).slice(0, 20);
 if (!mints.length) return NextResponse.json({ error: 'NO_MINTS' }, { status: 400 });
 const map: Record<string, Row> = {};
 // 1) radar first (fast, already cached)
 const notFound: string[] = [];
 for (const m of mints) {
  const hit = mem.get('r:' + m);
  if (hit && Date.now() < hit.exp) { map[m] = hit.v; continue; }
  notFound.push(m);
 }
 if (notFound.length) {
  try {
   const pages = await Promise.all([1, 2].map(p => fetch(`http://127.0.0.1:3000/api/coins?page=${p}`, { signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : null).catch(() => null)));
   const coins: any[] = pages.flatMap((p: any) => (p?.coins || []));
   for (const m of [...notFound]) {
    const c = coins.find((x: any) => x.poolAddress === m || x.id === m);
    if (c?.price > 0) {
     const row: Row = { price: c.price, sym: c.sym, name: c.name, image: c.image || null, source: 'radar' };
     mem.set('r:' + m, { v: row, exp: Date.now() + TTL });
     map[m] = row;
    }
   }
  } catch {}
 }
 // 2) DexScreener on-demand for the rest
 for (const m of mints) {
  if (!map[m]) { const row = await fromDex(m); if (row) map[m] = row; }
 }
 return NextResponse.json({ prices: map, updatedAt: new Date().toISOString() });
}
