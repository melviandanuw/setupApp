// QA-10 crash regression: no route may kill the process when Postgres is down.
const request = require('supertest');
process.env.JWT_SECRET = 'test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY = 'ab'.repeat(32);
process.env.CREATOR_X_USER_ID = '123';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.X_LOGIN_REQUIRED = 'true';
jest.mock('../src/lib/db', () => ({ query: jest.fn().mockRejectedValue(new Error('password authentication failed')), pool: { connect: jest.fn().mockRejectedValue(new Error('password authentication failed')) } }));
jest.mock('../src/lib/redis', () => ({ redis: { get: jest.fn().mockResolvedValue(null), setex: jest.fn(), del: jest.fn() } }));
jest.mock('../src/lib/price', () => ({ getPrice: jest.fn().mockResolvedValue({ price: 1, ts: Date.now() }) }));
const jwt = require('jsonwebtoken');
const app = require('../src/index');
const t = jwt.sign({ uid: 'u1' }, process.env.JWT_SECRET);
describe('QA-10 DB down: every route degrades, none crash', () => {
 test('POST /trade -> 503 DB_UNAVAILABLE', async () => {
  const r = await request(app).post('/trade').set('Cookie', `wenits=${t}`).send({ mint: '5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9', side: 'buy', usd: 10, idempotencyKey: 'crash-trade-01' });
  expect(r.status).toBe(503); expect(r.body.error).toBe('DB_UNAVAILABLE');
 });
 test('GET /trade/portfolio -> 503 DB_UNAVAILABLE', async () => {
  const r = await request(app).get('/trade/portfolio').set('Cookie', `wenits=${t}`);
  expect(r.status).toBe(503);
 });
 test('GET /auth/x/follow-status -> 503 DB_UNAVAILABLE', async () => {
  const r = await request(app).get('/auth/x/follow-status').set('Cookie', `wenits=${t}`);
  expect(r.status).toBe(503);
 });
 test('GET /board/weekly -> 200 offline:true', async () => {
  const r = await request(app).get('/board/weekly');
  expect(r.status).toBe(200); expect(r.body.offline).toBe(true);
 });
 test('GET /health still 200 (process alive)', async () => {
  const r = await request(app).get('/health');
  expect(r.status).toBe(200);
 });
});
