#!/usr/bin/env node
// B4 leaderboard settlement: snapshot equity per user -> leaderboard_weeks/entries.
// Equity = cash + sum(qty * current price). Price via getPrice(); missing price = avg_entry fallback.
// Usage: node src/jobs/settle-board.js [--week=YYYY-Www] [--dry]
// Env: DATABASE_URL.
require('dotenv').config();
const { query, pool } = require('../lib/db');
const { getPrice } = require('../lib/price');
function weekId(d = new Date()) {
 const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
 const day = (t.getUTCDay() + 6) % 7; // Monday=0
 t.setUTCDate(t.getUTCDate() - day + 3);
 const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
 const fday = (first.getUTCDay() + 6) % 7;
 first.setUTCDate(first.getUTCDate() - fday + 3);
 const w = 1 + Math.round((t - first) / (7 * 864e5));
 return `${t.getUTCFullYear()}-W${String(w).padStart(2, '0')}`;
}
async function settle({ dry = false, week = weekId() } = {}) {
 const users = (await query('SELECT id, x_username FROM users WHERE is_gated=false')).rows;
 const rows = [];
 for (const u of users) {
  const pf = (await query('SELECT cash_usd FROM portfolios WHERE user_id=$1', [u.id])).rows[0];
  const cash = parseFloat(pf?.cash_usd || '0');
  const pos = (await query('SELECT mint, qty, avg_entry FROM positions WHERE user_id=$1', [u.id])).rows;
  let equity = cash;
  for (const p of pos) {
   const qty = parseFloat(p.qty);
   let px = parseFloat(p.avg_entry);
   try { px = (await getPrice(p.mint)).price; } catch (_) {}
   equity += qty * px;
  }
  rows.push({ user_id: u.id, x_username: u.x_username, equity });
 }
 rows.sort((a, b) => b.equity - a.equity);
 if (dry) return { week, rows };
 const cli = await pool.connect();
 try {
  await cli.query('BEGIN');
  await cli.query(
   'INSERT INTO leaderboard_weeks(week_id, starts_at, ends_at) VALUES($1, now(), now()+interval \'7 days\') ON CONFLICT (week_id) DO NOTHING',
   [week]
  );
  let rank = 0;
  for (const r of rows) {
   rank++;
   await cli.query(
    `INSERT INTO leaderboard_entries(week_id, user_id, equity_usd, rank) VALUES($1,$2,$3,$4)
     ON CONFLICT (week_id, user_id) DO UPDATE SET equity_usd=EXCLUDED.equity_usd, rank=EXCLUDED.rank`,
    [week, r.user_id, r.equity.toFixed(2), rank]
   );
  }
  await cli.query('COMMIT');
 } catch (e) { await cli.query('ROLLBACK'); throw e; } finally { cli.release(); }
 return { week, settled: rows.length };
}
async function main() {
 const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
 const dry = !!args.dry;
 const week = args.week || weekId();
 try {
  const out = await settle({ dry, week });
  console.log(`[settle-board] week=${out.week} rows=${(out.rows || []).length || out.settled || 0}${dry ? ' DRY' : ''}`);
  if (dry) for (const r of (out.rows || []).slice(0, 10)) console.log(`  # ${r.x_username} $${r.equity.toFixed(2)}`);
  process.exit(0);
 } catch (e) { console.error('[settle-board]', e.message); process.exit(1); }
}
if (require.main === module) main();
module.exports = { settle, weekId };
