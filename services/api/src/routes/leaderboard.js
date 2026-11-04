const ex = require('express'); const { query } = require('../lib/db'); const R = ex.Router();
R.get('/weekly', async (req, res) => {
  try {
    const w = await query('SELECT week_id FROM leaderboard_weeks ORDER BY ends_at DESC LIMIT 1');
    if (!w.rowCount) return res.json({ entries: [] });
    const e = await query('SELECT u.x_username,e.equity_usd,e.rank FROM leaderboard_entries e JOIN users u ON u.id=e.user_id WHERE week_id=$1 ORDER BY rank ASC LIMIT 100', [w.rows[0].week_id]);
    // L4 reward batch 1: badge musim by rank (computed, no schema change).
    // Spotlights + min-5-trade check manual via sheet (see docs/product/REWARD_BATCH1.md).
    const entries = e.rows.map(r => ({
     ...r,
     badge: r.rank === 1 ? 'GOLD DEGEN' : r.rank === 2 ? 'SILVER DEGEN' : r.rank === 3 ? 'BRONZE DEGEN' : null,
    }));
    res.json({ week: w.rows[0].week_id, entries, season: { badge: 'season-1', note: 'badge + spotlight, min 5 trades, manual review' } });
  } catch (err) { res.json({ entries: [], offline: true }); }
});
module.exports = R;
