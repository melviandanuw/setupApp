// Dev-anon portfolio fallback: file-backed store when Postgres is unreachable.
// Lets BUY/SELL buttons work in dev without DB. NOT for production.
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'dev-portfolio.json');
function load() {
 try {
  const j = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  if (j && typeof j.cash === 'number' && j.positions) return j;
 } catch (_) {}
 return { cash: 10000, positions: {}, trades: [] };
}
function save(s) {
 fs.mkdirSync(path.dirname(FILE), { recursive: true });
 fs.writeFileSync(FILE, JSON.stringify(s));
}
function getStore() { return load(); }
function buy(mint, price, usd, key) {
 const s = load();
 if (s.trades.find(t => t.key === key)) return { ok: true, duplicate: true, ...s.trades.find(t => t.key === key).out };
 if (s.cash < usd) { const e = new Error('INSUFFICIENT_CASH'); e.status = 400; throw e; }
 const qty = usd / price;
 s.cash -= usd;
 const p = s.positions[mint] || { qty: 0, avg: 0 };
 p.avg = (p.avg * p.qty + usd) / (p.qty + qty);
 p.qty += qty;
 s.positions[mint] = p;
 const out = { price, qty, notional: usd };
 s.trades.push({ key, out });
 save(s);
 return { ok: true, ...out };
}
function sell(mint, price, usd, key) {
 const s = load();
 if (s.trades.find(t => t.key === key)) return { ok: true, duplicate: true, ...s.trades.find(t => t.key === key).out };
 const qty = usd / price;
 const p = s.positions[mint];
 if (!p || p.qty < qty) { const e = new Error('INSUFFICIENT_QTY'); e.status = 400; throw e; }
 p.qty -= qty;
 s.cash += qty * price;
 const out = { price, qty, notional: qty * price };
 s.trades.push({ key, out });
 save(s);
 return { ok: true, ...out };
}
module.exports = { getStore, buy, sell };
