const{redis}=require('./redis');
const STALE=parseInt(process.env.PRICE_STALE_MS||'15000',10);
async function getPrice(mint){const raw=await redis.hgetall(`px:${mint}`);if(!raw||!raw.price)throw Object.assign(new Error('PRICE_UNAVAILABLE'),{status:503});const age=Date.now()-parseInt(raw.ts||'0',10);if(age>STALE)throw Object.assign(new Error('PRICE_STALE'),{status:503});return{price:parseFloat(raw.price),ts:parseInt(raw.ts,10)};}
async function setPrice(mint, price) {
 // hset multi-field unsupported on old Redis (v3 winget build) -> pipeline single-field
 const pipe = redis.pipeline();
 pipe.hset(`px:${mint}`, 'price', String(price));
 pipe.hset(`px:${mint}`, 'ts', String(Date.now()));
 await pipe.exec();
}
module.exports={getPrice,setPrice};
// dev-anon on-demand: fetch DexScreener pair price, cache to px:<pair>.
async function fetchPrice(mint) {
 const r = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${encodeURIComponent(mint)}`, {
  headers: { 'User-Agent': 'Wenits.fun/1.0 (trade-fallback)' },
  signal: AbortSignal.timeout(12000),
 });
 if (!r.ok) throw Object.assign(new Error('PRICE_UNAVAILABLE'), { status: 503 });
 const j = await r.json();
 const p = (j.pairs || [])[0] || j.pair;
 if (!p || !p.priceUsd) throw Object.assign(new Error('PRICE_UNAVAILABLE'), { status: 503 });
 const price = parseFloat(p.priceUsd);
 try { await setPrice(mint, price); } catch (_) {}
 return { price, ts: Date.now() };
}
module.exports.fetchPrice = fetchPrice;
