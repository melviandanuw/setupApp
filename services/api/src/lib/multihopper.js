// MultiHopper API client (thin wrapper, no secrets committed).
// Env: MH_BASE_URL (https://devnet.multihopper.com | https://multihopper.com), MH_API_KEY (mh_test_* | mh_live_*).
// Flow per quickstart: estimate -> create -> prepare -> [sign keeperFundingTx FIRST] -> confirm-broadcast -> monitor.
const BASE = () => String(process.env.MH_BASE_URL || 'https://devnet.multihopper.com').replace(/\/$/, '');
const KEY = () => process.env.MH_API_KEY || '';

async function mh(path, { method = 'GET', body = null } = {}) {
  if (!KEY()) throw Object.assign(new Error('MH_NOT_CONFIGURED'), { status: 503 });
  const r = await fetch(BASE() + '/api/v1' + path, {
    method,
    headers: { 'x-api-key': KEY(), 'Content-Type': 'application/json', 'User-Agent': 'Wenits.fun/1.0 (payout-rail)' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || ('MH_' + r.status)), { status: 502, detail: j });
  return j;
}

const estimate = (p) => mh('/transfers/estimate', { method: 'POST', body: p });
const createTransfer = (p) => mh('/transfers', { method: 'POST', body: p });
const prepareTransfer = (id) => mh(`/transfers/${id}/prepare`, { method: 'POST' });
const confirmBroadcast = (id, sigs) => mh(`/transfers/${id}/confirm-broadcast`, { method: 'POST', body: sigs });
const getTransfer = (id) => mh(`/transfers/${id}`);

module.exports = { mh, estimate, createTransfer, prepareTransfer, confirmBroadcast, getTransfer };
