const { query } = require('../lib/db');
function xLoginRequired() { return String(process.env.X_LOGIN_REQUIRED || 'false').toLowerCase() === 'true'; }
async function requireAuthOptional(req, res, next) {
  if (!xLoginRequired()) { req.uid = 'dev-anon'; return next(); }
  return require('../middleware/auth').requireAuth(req, res, next);
}
async function requireUngated(req, res, next) {
  if (!xLoginRequired()) return next();
  try {
   const r = await query('SELECT is_gated FROM users WHERE id=$1', [req.uid]);
   if (!r.rowCount) return res.status(401).json({ error: 'NO_USER' });
   if (r.rows[0].is_gated) return res.status(403).json({ error: 'FOLLOW_REQUIRED' });
   next();
  } catch (e) { return res.status(503).json({ error: 'DB_UNAVAILABLE' }); }
}
module.exports = { requireUngated, requireAuthOptional, xLoginRequired };
