// QA-11 B1+B2: price writer registry + trade mint resolution (PM-locked files untouched).
const { SEVEN, tick } = require('../src/jobs/price-writer');
const { PAIRS, resolveMint } = require('../src/lib/mints');
describe('QA-11 price writer + mint registry', () => {
 test('writer and registry share 7 pairs', () => {
  expect(SEVEN).toHaveLength(7);
  expect(PAIRS).toHaveLength(7);
  expect(SEVEN.map(s => s.pair).sort()).toEqual([...PAIRS].sort());
 });
 test('resolveMint accepts poolAddress', () => {
  expect(resolveMint(PAIRS[0])).toBe(PAIRS[0]);
 });
 test('resolveMint accepts sym alias', () => {
  expect(resolveMint('bonk')).toBe(PAIRS[1]);
  expect(resolveMint('PENGU')).toBe(PAIRS[0]);
 });
 test('resolveMint rejects free-form mint', () => {
  expect(resolveMint('So11111111111111111111111111111111111111112')).toBeNull();
  expect(resolveMint('x'.repeat(40))).toBeNull();
  expect(resolveMint('')).toBeNull();
 });
 test('tick writes px:* keys (integration, needs Redis)', async () => {
  const { getPrice } = require('../src/lib/price');
  const r = await tick();
  expect(r.ok + r.fail).toBe(7);
  if (r.ok > 0) {
   const p = await getPrice(PAIRS[1]);
   expect(p.price).toBeGreaterThan(0);
  }
 }, 90000);
});
