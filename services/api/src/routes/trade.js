const ex = require('express'); const { z } = require('zod'); const { query } = require('../lib/db'); const { getPrice } = require('../lib/price'); const { requireAuthOptional, requireUngated } = require('../middleware/gating');
const R = ex.Router(); R.use(requireAuthOptional, requireUngated);
const S=z.object({mint:z.string().min(2).max(64),side:z.enum(['buy','sell']),usd:z.number().positive().max(100000).optional(),qty:z.number().positive().optional(),idempotencyKey:z.string().min(8).max(64)}).refine(d=>d.usd||d.qty,{message:'usd-or-qty'});
const{resolveMint}=require('../lib/mints');
R.post('/',async(req,res)=>{const p=S.safeParse(req.body);if(!p.success)return res.status(400).json({error:'BAD_INPUT',d:p.error.issues});
const{side,idempotencyKey}=p.data;
let mint=resolveMint(p.data.mint);
// dev-anon: accept any radar poolAddress (base58 32-44) — registry only covers 7 legacy pairs
const DEV = String(req.uid) === 'dev-anon' && !require('../middleware/gating').xLoginRequired();
if(!mint && DEV && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(p.data.mint||''))) mint = String(p.data.mint);
if(!mint) return res.status(400).json({error:'UNKNOWN_MINT'});
const { getPrice, fetchPrice } = require('../lib/price');
let price; try { price = (await getPrice(mint)).price; } catch (e) {
 // dev-anon: on-demand DexScreener price for radar pools not covered by writer
 if (DEV) { try { price = (await fetchPrice(mint)).price; } catch (e2) { return res.status(e2.status || 503).json({ error: e2.message }); } }
 else return res.status(e.status || 503).json({ error: e.message });
}
let cli = null;
try { cli = await require('../lib/db').pool.connect(); }
catch (e) {
 // dev-anon fallback: no DB -> file store (keeps buttons working in dev)
 if (String(req.uid) === 'dev-anon' && !require('../middleware/gating').xLoginRequired()) {
  try {
   const ds = require('../lib/devstore');
   const out = side === 'buy' ? ds.buy(mint, price, p.data.usd, idempotencyKey) : ds.sell(mint, price, p.data.usd, idempotencyKey);
   return res.json(out);
  } catch (de) { return res.status(de.status || 500).json({ error: de.message }); }
 }
 console.error('db-connect', e.message); return res.status(503).json({ error: 'DB_UNAVAILABLE' });
}
try{await cli.query('BEGIN');
const ex0=await cli.query('SELECT id FROM trades WHERE idempotency_key=$1',[idempotencyKey]);if(ex0.rowCount){await cli.query('ROLLBACK');return res.json({ok:true,duplicate:true});}
await cli.query('SELECT cash_usd FROM portfolios WHERE user_id=$1 FOR UPDATE',[req.uid]);
const pf=(await cli.query('SELECT cash_usd FROM portfolios WHERE user_id=$1',[req.uid])).rows[0];if(!pf){await cli.query('ROLLBACK');return res.status(404).json({error:'NO_PORTFOLIO'});}
let qty,notional;
if(side==='buy'){notional=p.data.usd??0;if(!p.data.usd)return res.status(400).json({error:'USD_REQUIRED_BUY'});if(parseFloat(pf.cash_usd)<notional){await cli.query('ROLLBACK');return res.status(400).json({error:'INSUFFICIENT_CASH'});}qty=notional/price;
await cli.query('UPDATE portfolios SET cash_usd=cash_usd-$1,updated_at=now() WHERE user_id=$2',[notional,req.uid]);
const pos=await cli.query('SELECT qty,avg_entry FROM positions WHERE user_id=$1 AND mint=$2 FOR UPDATE',[req.uid,mint]);
if(pos.rowCount){const nq=parseFloat(pos.rows[0].qty)+qty;const na=(parseFloat(pos.rows[0].avg_entry)*parseFloat(pos.rows[0].qty)+notional)/nq;await cli.query('UPDATE positions SET qty=$1,avg_entry=$2 WHERE user_id=$3 AND mint=$4',[nq,na,req.uid,mint]);}
else await cli.query('INSERT INTO positions(user_id,mint,qty,avg_entry) VALUES($1,$2,$3,$4)',[req.uid,mint,qty,price]);}
else{qty=p.data.qty??(p.data.usd/price);notional=qty*price;
const pos=await cli.query('SELECT qty FROM positions WHERE user_id=$1 AND mint=$2 FOR UPDATE',[req.uid,mint]);
if(!pos.rowCount||parseFloat(pos.rows[0].qty)<qty){await cli.query('ROLLBACK');return res.status(400).json({error:'INSUFFICIENT_QTY'});}
await cli.query('UPDATE positions SET qty=qty-$1 WHERE user_id=$2 AND mint=$3',[qty,req.uid,mint]);
await cli.query('UPDATE portfolios SET cash_usd=cash_usd+$1 WHERE user_id=$2',[notional,req.uid]);}
await cli.query('INSERT INTO trades(user_id,mint,side,qty,price_usd,notional_usd,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7)',[req.uid,mint,side,qty,price,notional,idempotencyKey]);
await cli.query('COMMIT');res.json({ok:true,price,qty,notional});}
catch(e){try{await cli.query('ROLLBACK');}catch(_){}if(e.code==='23505')return res.json({ok:true,duplicate:true});console.error(e);res.status(500).json({error:'TRADE_FAILED'});}
finally{cli.release();}});
R.get('/portfolio',async(req,res)=>{try{const pf=await query('SELECT cash_usd FROM portfolios WHERE user_id=$1',[req.uid]);const ps=await query('SELECT mint,qty,avg_entry FROM positions WHERE user_id=$1',[req.uid]);res.json({cash:pf.rows[0]?.cash_usd??'0',positions:ps.rows});}catch(e){
 if (String(req.uid) === 'dev-anon' && !require('../middleware/gating').xLoginRequired()) { const s = require('../lib/devstore').getStore(); return res.json({ cash: String(s.cash.toFixed(2)), positions: Object.entries(s.positions).map(([mint,p])=>({mint,qty:String(p.qty),avg_entry:String(p.avg)})), dev: true }); }
 res.status(503).json({error:'DB_UNAVAILABLE',positions:[]});}});
module.exports=R;
