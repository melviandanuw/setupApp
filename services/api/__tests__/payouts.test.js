// Payout rail tests: admin guard + prepare/confirm happy path (MultiHopper mocked).
process.env.JWT_SECRET = 'test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY = 'ab'.repeat(32);
process.env.X_LOGIN_REQUIRED = 'true';
process.env.PAYOUT_ADMIN_TOKEN = 'admin-test-token';
jest.mock('../src/lib/db', () => ({ query: jest.fn(), pool: { connect: jest.fn() } }));
jest.mock('../src/lib/redis', () => ({ redis: { get: jest.fn(), setex: jest.fn(), del: jest.fn() } }));
jest.mock('../src/lib/multihopper', () => ({
  createTransfer: jest.fn(async () => ({ transfer: { id: 'tr-123' } })),
  confirmBroadcast: jest.fn(async () => ({ transfer: { status: 'processing' } })),
}));
const request = require('supertest');
const { query } = require('../src/lib/db');
const app = require('../src/index');
const ADM = { 'x-admin-token': 'admin-test-token' };
const good = {
  week_id: '2026-W49',
  payouts: [{ user_id: '123e4567-e89b-12d3-a456-426614174000', amount_usd: 10,
    token_mint: 'So11111111111111111111111111111111111111112', recipient: 'So11111111111111111111111111111111111111112' }],
};
describe('payouts rail (skeleton)', () => {
  beforeEach(() => { query.mockReset(); query.mockResolvedValue({ rowCount: 0, rows: [] }); });
  test('no admin token -> 401', async () => {
    const r = await request(app).post('/payouts/prepare').send(good);
    expect(r.status).toBe(401); expect(r.body.error).toBe('ADMIN_ONLY');
  });
  test('bad body -> 400', async () => {
    const r = await request(app).post('/payouts/prepare').set(ADM).send({ week_id: 'x' });
    expect(r.status).toBe(400);
  });
  test('prepare ok -> stores transfer id', async () => {
    const r = await request(app).post('/payouts/prepare').set(ADM).send(good);
    expect(r.status).toBe(200); expect(r.body.ok).toBe(true);
    expect(r.body.payouts[0].transfer_id).toBe('tr-123');
  });
  test('confirm ok -> processing', async () => {
    const r = await request(app).post('/payouts/confirm').set(ADM)
      .send({ transfer_id: 'tr-123', signatures: { keeperFundingSignature: 'sig1' } });
    expect(r.status).toBe(200); expect(r.body.ok).toBe(true);
  });
  test('webhook bad sig -> 401', async () => {
    const r = await request(app).post('/payouts/webhook').send({ transfer_id: 'tr-123' });
    expect(r.status).toBe(401);
  });
  test('week proof public, DB down -> offline:true', async () => {
    query.mockRejectedValueOnce(new Error('db down'));
    const r = await request(app).get('/payouts/week/2026-W49');
    expect(r.status).toBe(200); expect(r.body.offline).toBe(true);
  });
});
