// Payout rail: arena weekly winners -> MultiHopper Multi-Send.
// Admin-only (header x-admin-token = PAYOUT_ADMIN_TOKEN). No user funds touched.
// Flow: prepare (quote + createTransfer + prepareTransfer, store transferId)
//     -> confirm (admin signs txs off-band, posts sigs, we confirmBroadcast)
//     -> webhook (MultiHopper signed completion -> status settled).
const ex = require('express');
const { z } = require('zod');
const { query } = require('../lib/db');
const R = ex.Router();

const adminOnly = (req, res, next) => {
  const want = String(process.env.PAYOUT_ADMIN_TOKEN || '');
  if (!want || req.headers['x-admin-token'] !== want) return res.status(401).json({ error: 'ADMIN_ONLY' });
  next();
};

const Prep = z.object({ week_id: z.string().min(3).max(16), payouts: z.array(z.object({
  user_id: z.string().uuid(), amount_usd: z.number().positive().max(10000),
  token_mint: z.string().min(32).max(44), recipient: z.string().min(32).max(44),
})).min(1).max(25) });

// POST /payouts/prepare — quote + create one MultiHopper transfer per winner, store as pending.
R.post('/prepare', adminOnly, async (req, res) => {
  const p = Prep.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'BAD_INPUT', d: p.error.issues });
  try {
    const mhx = require('../lib/multihopper');
    const out = [];
    for (const w of p.data.payouts) {
      // amount USD -> token raw: untuk skeleton pakai amountTokens string, konversi final di confirm.
      const created = await mhx.createTransfer({
        tokenMint: w.token_mint,
        amountTokens: String(w.amount_usd), // placeholder: ganti rate nyata saat onboarding produksi
        tokenDecimals: 9, // skeleton default; override per-mint saat produksi
        sourceOwner: process.env.PAYOUT_TREASURY_WALLET || '',
        recipientWallet: w.recipient,
        hops: 7,
        externalId: `wenits-${p.data.week_id}-${w.user_id.slice(0, 8)}`,
      });
      const tid = created?.transfer?.id ?? created?.id;
      await query(
        `INSERT INTO payouts(week_id,user_id,amount_usd,token_mint,transfer_id,status) VALUES($1,$2,$3,$4,$5,'prepared')
         ON CONFLICT DO NOTHING`, [p.data.week_id, w.user_id, w.amount_usd, w.token_mint, String(tid ?? '')]
      );
      out.push({ user_id: w.user_id, transfer_id: String(tid ?? ''), status: 'prepared' });
    }
    res.json({ ok: true, week_id: p.data.week_id, payouts: out });
  } catch (e) { res.status(e.status || 503).json({ error: e.message || 'PAYOUT_PREPARE_FAILED' }); }
});

// POST /payouts/confirm — admin posts collected signatures after signing off-band.
R.post('/confirm', adminOnly, async (req, res) => {
  const S = z.object({ transfer_id: z.string().min(1).max(64), signatures: z.object({}).passthrough() });
  const p = S.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'BAD_INPUT' });
  try {
    const mhx = require('../lib/multihopper');
    const done = await mhx.confirmBroadcast(p.data.transfer_id, p.data.signatures);
    await query(`UPDATE payouts SET status='processing' WHERE transfer_id=$1`, [p.data.transfer_id]);
    res.json({ ok: true, transfer: done?.transfer?.status || 'processing' });
  } catch (e) { res.status(e.status || 503).json({ error: e.message || 'PAYOUT_CONFIRM_FAILED' }); }
});

// POST /payouts/webhook — MultiHopper signed completion (verify secret, mark settled).
R.post('/webhook', async (req, res) => {
  const secret = String(process.env.MH_WEBHOOK_SECRET || '');
  if (!secret || req.headers['x-mh-signature'] !== secret) return res.status(401).json({ error: 'BAD_WEBHOOK_SIG' });
  const { transfer_id, tx_sig, status } = req.body || {};
  if (!transfer_id) return res.status(400).json({ error: 'BAD_INPUT' });
  try {
    await query(`UPDATE payouts SET status=$1, tx_sig=$2 WHERE transfer_id=$3`,
      [status === 'settled' ? 'settled' : 'processing', tx_sig || null, String(transfer_id)]);
    res.json({ ok: true });
  } catch (e) { res.status(503).json({ error: 'DB_UNAVAILABLE' }); }
});

// GET /payouts/week/:id — public proof (transfer ids, sigs, status). No secrets.
R.get('/week/:id', async (req, res) => {
  try {
    const r = await query(
      `SELECT week_id, user_id, amount_usd, token_mint, transfer_id, status, tx_sig, created_at
       FROM payouts WHERE week_id=$1 ORDER BY created_at ASC`, [req.params.id]);
    res.json({ week: req.params.id, payouts: r.rows });
  } catch (e) { res.json({ week: req.params.id, payouts: [], offline: true }); }
});

module.exports = R;
