/** QA-09 web: moon-score pure function (mirrors DexScreener market logic). */
function moonScore(p) {
 const ch24 = p.priceChange?.h24 || 0, ch6 = p.priceChange?.h6 || 0, ch1 = p.priceChange?.h1 || 0;
 const vol = p.volume?.h24 || 0, liq = p.liquidity?.usd || 1;
 let s = 50 + ch24 * 1.6 + ch6 * 1.1 + ch1 * .6 + Math.min((vol / liq) * 4, 22) - Math.min(Math.abs(ch24) * .5, 15);
 s = Math.max(2, Math.min(99, Math.round(s)));
 return { score: s, verdict: s >= 75 ? 'MOON LIKELY' : s >= 58 ? 'WATCH' : 'COOLING' };
}
describe('QA-09 moon score', () => {
 test('strong pump -> high score', () => {
  const r = moonScore({ priceChange: { h24: 40, h6: 15, h1: 5 }, volume: { h24: 5e6 }, liquidity: { usd: 1e6 } });
  expect(r.score).toBeGreaterThanOrEqual(75); expect(r.verdict).toBe('MOON LIKELY');
 });
 test('dump -> low score', () => {
  const r = moonScore({ priceChange: { h24: -30, h6: -10, h1: -5 }, volume: { h24: 1e5 }, liquidity: { usd: 1e6 } });
  expect(r.score).toBeLessThan(58); expect(r.verdict).toBe('COOLING');
 });
 test('bounds 2..99 always', () => {
  for (const ch of [-500, -50, 0, 50, 500]) {
   const r = moonScore({ priceChange: { h24: ch, h6: ch, h1: ch }, volume: { h24: 0 }, liquidity: { usd: 1 } });
   expect(r.score).toBeGreaterThanOrEqual(2); expect(r.score).toBeLessThanOrEqual(99);
  }
 });
 test('empty input defaults to neutral', () => {
  const r = moonScore({});
  expect(r.score).toBeGreaterThanOrEqual(40); expect(r.score).toBeLessThanOrEqual(60);
 });
});
