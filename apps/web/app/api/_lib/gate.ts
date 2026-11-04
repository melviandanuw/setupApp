// Safety Gate + Moon Score v2 — SPEC ARENA_GMGN_SPEC v0.2 (PM).
// Pure logic, tanpa AI realtime. Terpisah dari route agar bisa di-unit-test.
export type GateStatus = 'PASS' | 'RISKY' | 'REJECT';
export interface GateOut { status: GateStatus; reasons: string[]; newDegen: boolean }
// Umur pool dalam jam dari pool_created_at ISO (GeckoTerminal).
export function poolAgeHours(poolCreatedAt?: string | null): number | null {
 if (!poolCreatedAt) return null;
 const t = Date.parse(poolCreatedAt);
 if (Number.isNaN(t)) return null;
 return (Date.now() - t) / 3600000;
}
export function safetyGate(input: {
 price: number; liq: number; vol24h: number;
 ch24: number; poolAgeH: number | null;
 buys?: number | null; sells?: number | null;
 seenDup?: boolean;
}): GateOut {
 const reasons: string[] = [];
 let risky = false;
 // R4 data kosong -> REJECT
 if (!(input.price > 0) || !(input.liq > 0) || !(input.vol24h > 0)) {
  return { status: 'REJECT', reasons: ['EMPTY_DATA'], newDegen: false };
 }
 // R1 likuiditas minimal -> REJECT
 if (input.liq < 10000) return { status: 'REJECT', reasons: ['LOW_LIQ'], newDegen: false };
 // R7 duplikat ticker (bukan likuiditas terbesar) -> REJECT
 if (input.seenDup) return { status: 'REJECT', reasons: ['DUP_TICKER'], newDegen: false };
 // R2 wash: vol/liq > 8 + umur < 6 jam
 if (input.poolAgeH !== null && input.poolAgeH < 6 && input.vol24h / Math.max(input.liq, 1) > 8) {
  risky = true; reasons.push('WASH_SUSPECT');
 }
 // R3 manipulasi: |h24| > 500% (likuiditas tidak naik terverifikasi di arena via liq statis)
 if (Math.abs(input.ch24) > 500) { risky = true; reasons.push('SPIKE_SUSPECT'); }
 // R6 honeypot proxy: buys:sells >= 95:5 + harga naik tajam
 if (input.buys != null && input.sells != null) {
  const tot = input.buys + input.sells;
  if (tot > 20 && input.buys / tot >= 0.95 && input.ch24 > 50) { risky = true; reasons.push('HONEYPOT_SUSPECT'); }
 }
 // R5 new-degen: < 30 menit, skor max 60 (handled di moonScoreV2 via cap)
 const newDegen = input.poolAgeH !== null && input.poolAgeH < 0.5;
 return { status: risky ? 'RISKY' : 'PASS', reasons, newDegen };
}
export interface MoonIn {
 ch24: number; ch6: number; ch1: number;
 vol: number; liq: number;
 poolAgeH: number | null; risky: boolean; newDegen: boolean;
}
export function moonScoreV2(p: MoonIn): { score: number; verdict: string } {
 // momentum cap: h24 cap ±300, h6 ±150, h1 ±80 sebelum bobot
 const m24 = Math.max(-300, Math.min(300, p.ch24));
 const m6 = Math.max(-150, Math.min(150, p.ch6));
 const m1 = Math.max(-80, Math.min(80, p.ch1));
 let s = 50 + m24 * 1.2 + m6 * 0.8 + m1 * 0.4;
 s += Math.min((p.vol / Math.max(p.liq, 1)) * 3, 18);
 s += Math.min(Math.log10(Math.max(p.liq, 1)) * 2, 10);
 s -= Math.min(Math.abs(p.ch24) * 0.4, 14);
 if (p.poolAgeH !== null && p.poolAgeH < 2) s -= 15;
 else if (p.poolAgeH !== null && p.poolAgeH < 12) s -= 8;
 if (p.risky) s -= 12;
 if (p.newDegen) s = Math.min(s, 60);
 s = Math.max(2, Math.min(99, Math.round(s)));
 const verdict = s >= 75 ? 'MOON LIKELY' : s >= 58 ? 'WATCH' : s >= 40 ? 'COOLING' : 'AVOID / HIGH RISK';
 return { score: s, verdict };
}
