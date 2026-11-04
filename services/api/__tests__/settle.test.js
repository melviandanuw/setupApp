// QA-12 B4 settlement: equity math + rank order (mocked DB/price).
jest.mock('../src/lib/db', () => ({ query: jest.fn(), pool: { connect: jest.fn() } }));
jest.mock('../src/lib/price', () => ({ getPrice: jest.fn() }));
const { query } = require('../src/lib/db');
const { getPrice } = require('../src/lib/price');
const { settle, weekId } = require('../src/jobs/settle-board');
describe('QA-12 settlement', () => {
 test('weekId format YYYY-Www', () => {
  expect(weekId(new Date('2026-11-01'))).toMatch(/^\d{4}-W\d{2}$/);
 });
 test('equity = cash + qty*price, ranked desc (dry)', async () => {
  query
   .mockResolvedValueOnce({ rows: [{ id: 'u1', x_username: 'a' }, { id: 'u2', x_username: 'b' }] })
   .mockResolvedValueOnce({ rows: [{ cash_usd: '100.00' }] })
   .mockResolvedValueOnce({ rows: [{ mint: 'm1', qty: '10', avg_entry: '5' }] })
   .mockResolvedValueOnce({ rows: [{ cash_usd: '50.00' }] })
   .mockResolvedValueOnce({ rows: [] });
  getPrice.mockResolvedValue({ price: 7, ts: Date.now() });
  const out = await settle({ dry: true, week: '2026-W99' });
  expect(out.rows).toHaveLength(2);
  expect(out.rows[0].user_id).toBe('u1'); // 100+70=170
  expect(out.rows[0].equity).toBeCloseTo(170);
  expect(out.rows[1].equity).toBeCloseTo(50);
 });
 test('missing price falls back to avg_entry', async () => {
  query
   .mockResolvedValueOnce({ rows: [{ id: 'u1', x_username: 'a' }] })
   .mockResolvedValueOnce({ rows: [{ cash_usd: '0.00' }] })
   .mockResolvedValueOnce({ rows: [{ mint: 'm9', qty: '2', avg_entry: '3' }] });
  getPrice.mockRejectedValue(Object.assign(new Error('PRICE_STALE'), { status: 503 }));
  const out = await settle({ dry: true, week: '2026-W99' });
  expect(out.rows[0].equity).toBeCloseTo(6);
 });
});
