#!/usr/bin/env node
// B1 price writer: poll DexScreener 7 pairs -> Redis px:<PAIR> {price, ts}.
// Trade route reads px:* via getPrice(); stale > PRICE_STALE_MS rejected.
// Usage: node src/jobs/price-writer.js [--once]
// Env: REDIS_URL, PRICE_WRITE_INTERVAL_MS (default 60000).
require('dotenv').config();
const { setPrice } = require('../lib/price');
// NOTE: pair list duplicated from routes/market.js (that file is PM-locked,
// do not edit it). Single source after D2 mint-registry decision lands.
const SEVEN = [
 { id: 'PENGU', pair: 'HLRG1H83vGfHKoV9AYe2do8RcfTMZ5Kjkv19WLQf6VG3' },
 { id: 'BONK', pair: '5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9' },
 { id: 'POPCAT', pair: 'GaDLUkaMH1XG784V1kny54BJnSHkrWuxESDsJ9kSEZ1f' },
 { id: 'BOME', pair: 'DSUvc5qf5LJHHV5e2tD184ixotSnCnwj7i4jJa4Xsrmt' },
 { id: 'MYRO', pair: '5WGYajM1xtLy3QrLHGSX4YPwsso3jrjEsbU1VivUErzk' },
 { id: 'SLERF', pair: 'AgFnRLUScRD2E4nWQxW73hdbSN7eKEUb2jHX7tx9YTYc' },
 { id: 'JUP', pair: 'BfWjys1y25tRCdeTkXSDoMSotQrqEBRgSRxyeJS1syga' },
];
const DS = 'https://api.dexscreener.com/latest/dex';
async function tick() {
 let ok = 0, fail = 0;
 for (const c of SEVEN) {
  try {
   const r = await fetch(`${DS}/pairs/solana/${c.pair}`, {
    headers: { 'User-Agent': 'Wenits.fun/1.0 (price-writer)' },
    signal: AbortSignal.timeout(12000),
   });
   if (r.status === 429) { fail++; continue; }
   if (!r.ok) { fail++; continue; }
   const j = await r.json();
   const p = (j.pairs || [])[0] || j.pair;
   if (!p || !p.priceUsd) { fail++; continue; }
   await setPrice(c.pair, parseFloat(p.priceUsd));
   ok++;
  } catch (e) { fail++; }
  await new Promise(r => setTimeout(r, 800)); // stay under DS rate limit
 }
 const ts = new Date().toISOString();
 console.log(`[price-writer] ${ts} ok=${ok} fail=${fail}`);
 return { ok, fail };
}
async function main() {
 const once = process.argv.includes('--once');
 if (once) { await tick(); process.exit(0); }
 const iv = parseInt(process.env.PRICE_WRITE_INTERVAL_MS || '60000', 10);
 console.log(`[price-writer] polling every ${iv}ms, ${SEVEN.length} pairs`);
 tick().catch(e => console.error('[price-writer]', e.message));
 setInterval(() => tick().catch(e => console.error('[price-writer]', e.message)), iv);
}
if (require.main === module) main();
module.exports = { tick, SEVEN };
