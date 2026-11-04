// B2 mint registry: poolAddress -> canonical pair key for price lookup.
// Trade stores poolAddress as mint (auditable, spoof-resistant vs free-form mint).
// Source: same 7 DexScreener pairs as jobs/price-writer.js (unify after D2 lands).
const PAIRS = [
 'HLRG1H83vGfHKoV9AYe2do8RcfTMZ5Kjkv19WLQf6VG3', // PENGU
 '5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9', // BONK
 'GaDLUkaMH1XG784V1kny54BJnSHkrWuxESDsJ9kSEZ1f', // POPCAT
 'DSUvc5qf5LJHHV5e2tD184ixotSnCnwj7i4jJa4Xsrmt', // BOME
 '5WGYajM1xtLy3QrLHGSX4YPwsso3jrjEsbU1VivUErzk', // MYRO
 'AgFnRLUScRD2E4nWQxW73hdbSN7eKEUb2jHX7tx9YTYc', // SLERF
 'BfWjys1y25tRCdeTkXSDoMSotQrqEBRgSRxyeJS1syga', // JUP
];
const SET = new Set(PAIRS);
// resolveMint(input) -> canonical pair address, or null if unknown.
// Accepts: exact poolAddress (arena), legacy 7 ids/syms (compat), rejects free-form.
const ALIAS = {
 PENGU: PAIRS[0], BONK: PAIRS[1], POPCAT: PAIRS[2], BOME: PAIRS[3],
 MYRO: PAIRS[4], SLERF: PAIRS[5], JUP: PAIRS[6],
};
function resolveMint(input) {
 const s = String(input || '').trim();
 if (SET.has(s)) return s;
 const up = s.toUpperCase();
 if (ALIAS[up]) return ALIAS[up];
 return null;
}
module.exports = { PAIRS, resolveMint };
