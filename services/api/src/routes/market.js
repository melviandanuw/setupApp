const ex = require('express');
const { redis } = require('../lib/radar-cache');
const R = ex.Router();
// 7 top Solana memecoins — official mints. Price via DexScreener (fast, no key).
// pair = pool address likuiditas terbesar per koin (verifikasi via DexScreener search, Nov 2026).
const SEVEN = [
 { id: 'PENGU', sym: 'PENGU', pair: 'HLRG1H83vGfHKoV9AYe2do8RcfTMZ5Kjkv19WLQf6VG3', name: 'Pudgy Penguins', color: '#ff4d9d' },
 { id: 'BONK', sym: 'BONK', pair: '5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9', name: 'Bonk', color: '#ff8a00' },
 { id: 'POPCAT', sym: 'POPCAT', pair: 'GaDLUkaMH1XG784V1kny54BJnSHkrWuxESDsJ9kSEZ1f', name: 'Popcat', color: '#c8ff3e' },
 { id: 'BOME', sym: 'BOME', pair: 'DSUvc5qf5LJHHV5e2tD184ixotSnCnwj7i4jJa4Xsrmt', name: 'BOOK OF MEME', color: '#38e6ff' },
 { id: 'MYRO', sym: 'MYRO', pair: '5WGYajM1xtLy3QrLHGSX4YPwsso3jrjEsbU1VivUErzk', name: 'Myro', color: '#8b5bff' },
 { id: 'SLERF', sym: 'SLERF', pair: 'AgFnRLUScRD2E4nWQxW73hdbSN7eKEUb2jHX7tx9YTYc', name: 'Slerf', color: '#9945FF' },
 { id: 'JUP', sym: 'JUP', pair: 'BfWjys1y25tRCdeTkXSDoMSotQrqEBRgSRxyeJS1syga', name: 'Jupiter', color: '#2e6bff' },
];
const DS = 'https://api.dexscreener.com/latest/dex';
async function ds(path) {
 const r = await fetch(DS + path, { headers: { 'User-Agent': 'Wenits.fun/1.0' }, signal: AbortSignal.timeout(12000) });
 if (r.status === 429) throw Object.assign(new Error('DS_RATE_LIMIT'), { status: 429 });
 if (!r.ok) throw Object.assign(new Error('DS_' + r.status), { status: 502 });
 return r.json();
}
// moon score from DexScreener fields: 24h/6h change + volume/liq frenzy. 0-100.
function moonScore(p) {
 const ch24 = p.priceChange?.h24 || 0;
 const ch6 = p.priceChange?.h6 || 0;
 const ch1 = p.priceChange?.h1 || 0;
 const vol = p.volume?.h24 || 0, liq = p.liquidity?.usd || 1;
 const vRatio = vol / liq;
 let s = 50 + ch24 * 1.6 + ch6 * 1.1 + ch1 * .6 + Math.min(vRatio * 4, 22) - Math.min(Math.abs(ch24) * .5, 15);
 s = Math.max(2, Math.min(99, Math.round(s)));
 const verdict = s >= 75 ? 'MOON LIKELY' : s >= 58 ? 'WATCH' : 'COOLING';
 return { score: s, verdict };
}
function pickBest(pairs, mint) {
 const cands = (pairs || []).filter(p => p.chainId === 'solana' && String(p.baseToken?.address || '').startsWith(mint) && p.priceUsd);
 cands.sort((a, b) => ((b.liquidity?.usd) || 0) - ((a.liquidity?.usd) || 0));
 return cands[0] || null;
}
let refreshing = false;
async function refreshCoins() {
 if (refreshing) { const c = await redis.get('radar:coins'); return c ? JSON.parse(c) : null; }
 refreshing = true;
 try {
  const coins = await Promise.all(SEVEN.map(async meta => {
   try {
    const j = await ds('/pairs/solana/' + meta.pair);
    const p = (j.pairs || [])[0] || j.pair;
    if (!p || !p.priceUsd) return { ...meta, error: true };
    const { score, verdict } = moonScore(p);
    return {
     ...meta, price: parseFloat(p.priceUsd),
     change1h: p.priceChange?.h1 ?? 0, change6h: p.priceChange?.h6 ?? 0, change24h: p.priceChange?.h24 ?? 0,
     volume24h: p.volume?.h24 ?? 0, liquidity: p.liquidity?.usd ?? 0, marketCap: p.fdv ?? p.marketCap ?? 0,
     dex: p.dexId, pairUrl: p.url, image: p.info?.imageUrl || null,
     moon: score, verdict,
    };
   } catch (e) { return { ...meta, error: true }; }
  }));
  coins.sort((a, b) => (b.moon ?? 0) - (a.moon ?? 0));
  const out = { updatedAt: new Date().toISOString(), source: 'dexscreener', coins };
  await redis.setex('radar:coins', 120, JSON.stringify(out));
  refreshing = false;
  return out;
 } catch (e) { refreshing = false; console.error('coins', e.message); throw e; }
}
R.get('/coins', async (req, res) => {
 const cachedRaw = await redis.get('radar:coins');
 const cached = cachedRaw ? JSON.parse(cachedRaw) : null;
 if (cached) { // stale-while-revalidate: jawab instan, refresh di background
  const ageMs = Date.now() - new Date(cached.updatedAt).getTime();
  res.json({ ...cached, cached: true, stale: ageMs > 120000 });
  refreshCoins().catch(() => {});
  return;
 }
 try { const out = await refreshCoins(); if (!out) throw Object.assign(new Error('MARKET_EMPTY'), { status: 502 }); res.json({ ...out, cached: false }); }
 catch (e) { res.status(e.status || 502).json({ error: e.message || 'MARKET_FAILED' }); }
});
// Chart: GeckoTerminal OHLC per pool -> cari pool Solana likuiditas terbesar per mint.
const GT = 'https://api.geckoterminal.com/api/v2';
async function gt(path) {
 const r = await fetch(GT + path, { headers: { 'User-Agent': 'Wenits.fun/1.0' }, signal: AbortSignal.timeout(12000) });
 if (r.status === 429) throw Object.assign(new Error('GT_RATE_LIMIT'), { status: 429 });
 if (!r.ok) throw Object.assign(new Error('GT_' + r.status), { status: 502 });
 return r.json();
}
async function topPool(meta) {
 // cari pool GeckoTerminal по nama koin, ambil reserve terbesar
 const s = await gt('/search/pools?query=' + encodeURIComponent(meta.name) + '&network=solana&page=1');
 const pools = (s.data || []).filter(p => (p.attributes?.address || '').length > 20);
 pools.sort((a, b) => parseFloat(b.attributes?.reserve_in_usd || 0) - parseFloat(a.attributes?.reserve_in_usd || 0));
 return pools[0]?.attributes?.address || null;
}
const TF = { '1': 'minute', '7': 'hour', '30': 'hour' };
R.get('/chart/:id', async (req, res) => {
 try {
  const { id } = req.params; const days = String(req.query.days || '7');
  const meta = SEVEN.find(c => c.id === id);
  if (!meta) return res.status(400).json({ error: 'UNKNOWN_COIN' });
  const key = 'radar:chart:' + id + ':' + days;
  const cached = await redis.get(key);
  if (cached) return res.json({ ...JSON.parse(cached), cached: true });
  let candles = null, line = null;
  try {
   const pool = await topPool(meta);
   if (pool) {
    const ohlcv = await gt('/networks/solana/pools/' + pool + '/ohlcv/' + (TF[days] || 'hour') + '?aggregate=1&limit=168');
    const list = ohlcv.data?.attributes?.ohlcv_list || [];
    candles = list.map(c => ({ time: c[0], open: c[1], high: c[2], low: c[3], close: c[4], volume: c[5] })).filter(c => c.time > 0);
   }
  } catch (_) {}
  if (!candles || !candles.length) {
   // fallback: DexScreener pair price history tidak ada API publik — pakai titik flat dari harga kini
   const all = await redis.get('radar:coins');
   const cur = all ? (JSON.parse(all).coins || []).find(c => c.id === id) : null;
   if (cur?.price) { const now = Math.floor(Date.now() / 1000); line = Array.from({ length: 48 }, (_, i) => ({ time: now - (47 - i) * 3600, value: cur.price })); }
  }
  const out = { id, days, candles, line, updatedAt: new Date().toISOString(), source: 'geckoterminal' };
  await redis.setex(key, 300, JSON.stringify(out));
  res.json({ ...out, cached: false });
 } catch (e) { console.error('chart', e.message); res.status(e.status || 502).json({ error: e.message || 'CHART_FAILED' }); }
});
module.exports = R;
