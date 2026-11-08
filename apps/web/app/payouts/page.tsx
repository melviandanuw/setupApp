'use client';
import useSWR from 'swr';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const fet = (u: string) => fetch(u).then(async r => r.json().catch(() => ({})));
// Public proof page: weekly winners + MultiHopper transfer receipts.
// Data: GET /payouts/week/:id. Empty state until first real season settles.
export default function Payouts({ params }: { params: Promise<{ id?: string }> }) {
  const week = 'current';
  const { data } = useSWR(API + '/payouts/week/' + week, fet, { refreshInterval: 30000 });
  const rows: any[] = data?.payouts || [];
  return (<section style={{ paddingTop: 26 }}>
    <h2>Prize payouts</h2>
    <p className='lead'>Weekly arena winners, paid on-chain. Every row links a verifiable transfer.</p>
    {rows.length === 0 && <p style={{ color: 'var(--color-muted)' }}>
      {data ? 'No payouts settled yet — first season settles here.' : 'Loading payout proofs…'}</p>}
    {rows.map((p: any, i: number) => (<div key={i} className='tile' style={{ padding: 12, marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
        <b>#{i + 1}</b><span>${p.amount_usd}</span>
        <span className='tag neu' style={{ position: 'static' }}>{p.status}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12 }}>{p.week_id}</span>
      </div>
      <div style={{ fontSize: 12, marginTop: 6 }}>
        transfer <code>{p.transfer_id || '—'}</code>
        {p.tx_sig && <span> · <a href={'https://solscan.io/tx/' + p.tx_sig} target='_blank' rel='noreferrer'
          style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>solscan</a></span>}
      </div>
    </div>))}
  </section>);
}
