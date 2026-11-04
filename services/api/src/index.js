require('dotenv').config();const ex=require('express');const helmet=require('helmet');const cp=require('cookie-parser');const cors=require('cors');const rl=require('express-rate-limit');
const app = ex(); app.use(helmet()); app.use(ex.json({ limit: '50kb' })); app.use(cp());
// browser trade fetch needs CORS (arena -> api cross-port)
const ORIGINS = String(process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: (o, cb) => (!o || ORIGINS.includes(o) ? cb(null, true) : cb(new Error('CORS_BLOCKED'))), credentials: true }));
const TEST = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
const lim = (w, m) => rl({ windowMs: w, max: TEST ? 10000 : m });
app.use('/auth', lim(60 * 1000, 20)); app.use('/trade', lim(10 * 1000, 10)); app.use('/market', lim(60 * 1000, 30));
app.use('/auth',require('./routes/auth'));app.use('/trade',require('./routes/trade'));app.use('/board',require('./routes/leaderboard'));app.use('/market',require('./routes/market'));
app.get('/health', (q, s) => s.json({ ok: true }));
if (require.main === module) app.listen(process.env.PORT || 8080, () => console.log('api up'));
module.exports = app;
