import { NextResponse } from 'next/server';
// Wenits internal chart API — GeckoTerminal OHLC, memory cache 5 min.
const NAMES: Record<string, string> = {
 PENGU: 'Pudgy Penguins', BONK: 'Bonk', POPCAT: 'Popcat', BOME: 'BOOK OF MEME',
 MYRO: 'Myro', SLERF: 'Slerf', JUP: 'Jupiter',
};
const mem = new Map<string, { v: any; exp: number }>();
export async function GET(req: Request) {
 const u = new URL(req.url);
 const id = (u.searchParams.get('id') || '').toUpperCase();
 const days = u.searchParams.get('days') || '7';
 if (!NAMES[id]) return NextResponse.json({ error: 'UNKNOWN_COIN' }, { status: 400 });
 const key = 'ch:' + id + ':' + days;
 const hit = mem.get(key);
 if (hit && Date.now() < hit.exp) return NextResponse.json({ ...hit.v, cached: true });
 try {
  const s = await fetch('https://api.geckoterminal.com/api/v2/search/pools?query=' + encodeURIComponent(NAMES[id]) + '&network=solana&page=1');
  const sj: any = await s.json();
  const pools = (sj.data || []).filter((p: any) => (p.attributes?.address || '').length > 20)
   .sort((a: any, b: any) => parseFloat(b.attributes?.reserve_in_usd || 0) - parseFloat(a.attributes?.reserve_in_usd || 0));
  const pool = pools[0]?.attributes?.address;
  let candles = null;
  if (pool) {
   const tf = days === '1' ? 'minute' : 'hour';
   const o = await fetch(`https://api.geckoterminal.com/api/v2/networks/solana/pools/${pool}/ohlcv/${tf}?aggregate=1&limit=168`);
   const oj: any = await o.json();
   const list = oj.data?.attributes?.ohlcv_list || [];
   candles = list.map((c: any) => ({ time: c[0], open: c[1], high: c[2], low: c[3], close: c[4], volume: c[5] })).filter((c: any) => c.time > 0);
  }
  const out = { id, days, candles, line: null, updatedAt: new Date().toISOString(), source: 'wenits-internal/geckoterminal' };
  mem.set(key, { v: out, exp: Date.now() + 300000 });
  return NextResponse.json({ ...out, cached: false });
 } catch (e: any) {
  return NextResponse.json({ error: 'CHART_FAILED' }, { status: 502 });
 }
}
