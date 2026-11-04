// QA-13 Safety Gate + Moon Score v2 (SPEC ARENA_GMGN_SPEC v0.2).
// gate.ts is TS; jest web runs babel without TS preset, so transpile real source here.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const src = fs.readFileSync(path.join(__dirname, '..', 'app', 'api', '_lib', 'gate.ts'), 'utf8');
const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const _m = new (require('module'))('gate');
_m._compile(outputText, path.join(__dirname, 'gate.js'));
const { safetyGate, moonScoreV2, poolAgeHours } = _m.exports;
describe('QA-13 gate', () => {
 test('REJECT: low liq', () => {
  expect(safetyGate({ price: 1, liq: 9999, vol24h: 1e5, ch24: 10, poolAgeH: 48 }).status).toBe('REJECT');
 });
 test('REJECT: empty data', () => {
  expect(safetyGate({ price: 0, liq: 0, vol24h: 0, ch24: 0, poolAgeH: null }).status).toBe('REJECT');
 });
 test('RISKY: wash vol/liq>8 + young pool', () => {
  const r = safetyGate({ price: 1, liq: 20000, vol24h: 200000, ch24: 60, poolAgeH: 2 });
  expect(r.status).toBe('RISKY'); expect(r.reasons).toContain('WASH_SUSPECT');
 });
 test('RISKY: spike |h24|>500', () => {
  const r = safetyGate({ price: 1, liq: 50000, vol24h: 10000, ch24: 600, poolAgeH: 48 });
  expect(r.status).toBe('RISKY'); expect(r.reasons).toContain('SPIKE_SUSPECT');
 });
 test('RISKY: honeypot imbalance 95:5 + pump', () => {
  const r = safetyGate({ price: 1, liq: 50000, vol24h: 30000, ch24: 80, poolAgeH: 48, buys: 95, sells: 5 });
  expect(r.status).toBe('RISKY'); expect(r.reasons).toContain('HONEYPOT_SUSPECT');
 });
 test('NEW-DEGEN: <30min caps score 60', () => {
  const g = safetyGate({ price: 1, liq: 50000, vol24h: 20000, ch24: 200, poolAgeH: 0.2 });
  expect(g.newDegen).toBe(true);
  const { score } = moonScoreV2({ ch24: 200, ch6: 100, ch1: 50, vol: 20000, liq: 50000, poolAgeH: 0.2, risky: false, newDegen: true });
  expect(score).toBeLessThanOrEqual(60);
 });
 test('PASS normal pool', () => {
  expect(safetyGate({ price: 1, liq: 100000, vol24h: 50000, ch24: 5, poolAgeH: 72 }).status).toBe('PASS');
 });
});
describe('QA-13 moon v2', () => {
 test('verdict bands', () => {
  const mk = (s) => ({ ch24: 0, ch6: 0, ch1: 0, vol: 2e4, liq: 1e5, poolAgeH: 72, risky: false, newDegen: false, ...s });
  expect(moonScoreV2(mk({ ch24: 120, ch6: 40, ch1: 10 })).verdict).toBe('MOON LIKELY');
  expect(moonScoreV2(mk({ ch24: 8, ch6: 3, ch1: 1 })).verdict).toBe('WATCH');
  expect(moonScoreV2(mk({ ch24: -2 })).verdict).toBe('COOLING');
  expect(moonScoreV2(mk({ ch24: -80, ch6: -40, ch1: -20 })).verdict).toBe('AVOID / HIGH RISK');
 });
 test('bounds 2..99 + risky penalty', () => {
  const base = { ch24: 25, ch6: 8, ch1: 2, vol: 5e4, liq: 2e5, poolAgeH: 100, risky: false, newDegen: false };
  const a = moonScoreV2(base).score;
  const b = moonScoreV2({ ...base, risky: true }).score;
  expect(b).toBeLessThan(a);
  expect(a).toBeGreaterThan(50); expect(a).toBeLessThanOrEqual(99); expect(b).toBeGreaterThanOrEqual(2);
  const cap = moonScoreV2({ ch24: 500, ch6: 300, ch1: 150, vol: 1e9, liq: 1e9, poolAgeH: 100, risky: false, newDegen: false }).score;
  expect(cap).toBeLessThanOrEqual(99);
 });
 test('poolAgeHours parses ISO', () => {
  expect(poolAgeHours(new Date(Date.now() - 3600000).toISOString())).toBeCloseTo(1, 0);
  expect(poolAgeHours(null)).toBeNull(); expect(poolAgeHours('x')).toBeNull();
 });
});
