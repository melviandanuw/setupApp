'use client';
import useSWRInfinite from 'swr/infinite';
import { useEffect, useRef, useState } from 'react';
const fet = (u: string) => fetch(u).then(async r => { const j = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(j.error || ('HTTP ' + r.status)), { status: r.status }); return j; });
const getKey = (i: number, prev: any) => {
 if (prev && prev.hasMore === false) return null;
 return `/api/coins?page=${i + 1}`;
};
export default function Radar() {
 const [flt, setFlt] = useState<'all' | 'fresh' | 'est'>('all');
 const { data, error, mutate, size, setSize, isLoading, isValidating } = useSWRInfinite(getKey, fet, {
  revalidateFirstPage: false, persistSize: true, revalidateOnFocus: false,
  dedupingInterval: 30000, errorRetryInterval: 15000, keepPreviousData: true,
  refreshInterval: 180000,
 });
 const [showErr, setShowErr] = useState(false);
 useEffect(() => {
  if (!error) { setShowErr(false); return; }
  setShowErr(true);
  const t = setTimeout(() => setShowErr(false), 6000);
  return () => clearTimeout(t);
 }, [error]);
 const pages = data || [];
 const rawCoins = pages.flatMap((p: any) => p.coins || []);
 const coins = rawCoins.filter((c: any) => flt === 'fresh' ? (c.poolAgeH != null && c.poolAgeH < 48) : flt === 'est' ? (c.poolAgeH == null || c.poolAgeH >= 168) : true);
 const lastPg = pages.length ? pages[pages.length - 1] : null;
 const hasMore = pages.length ? !(lastPg && lastPg.hasMore === false) : true;
 const empty = pages.length > 0 && coins.length === 0;
 const settled = !isValidating;
 const moreRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
  if (!moreRef.current || !hasMore || !settled) return;
  const el = moreRef.current;
  const ob = new IntersectionObserver(es => { if (es[0].isIntersecting) setSize(s => s + 1); }, { rootMargin: '600px' });
  ob.observe(el); return () => ob.disconnect();
 }, [hasMore, settled, size, setSize]);
 const firstAge = pages[0] ? Math.max(0, Math.round((Date.now() - new Date(pages[0].updatedAt).getTime()) / 1000)) : null;
 return (<section style={{ paddingTop: 26 }}>
  <h2>Moon Radar</h2>
  <p className='lead'>Live Solana trending and fresh pools, refreshed every 3 minutes. Moon Score 0–100 blends 24h momentum, volume frenzy, and liquidity depth. A high score is not a guarantee. Not financial advice.</p>
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '16px 0', flexWrap: 'wrap' }}>
   <button className='btn' style={{ padding: '9px 18px', fontSize: 14 }} onClick={() => mutate()}>Refresh now</button>
   {(['all', 'fresh', 'est'] as const).map(f => (<button key={f} className='btn btn--ghost' style={{ padding: '9px 16px', fontSize: 13, borderColor: flt === f ? 'var(--color-accent)' : undefined }} onClick={() => setFlt(f)}>{f === 'all' ? 'All pools' : f === 'fresh' ? 'Fresh under 48h' : 'Established 7d+'}</button>))}
   <span style={{ fontSize: 12 }}>Fresh = bigger moves, bigger risk. Established = deeper liquidity, slower moves.</span>
  </div>
  <div style={{ fontSize: 13, minHeight: 18 }}>
   {isLoading && !pages.length ? 'Loading live hype…' : pages.length ? `Page ${size} · ${coins.length} coins · updated ${firstAge}s ago` : ''}
   {isValidating && pages.length ? ' · updating…' : ''}
  </div>
  {showErr && <p style={{ color: 'var(--color-accent)' }}>Feed hiccup — retrying in the background, showing last data.</p>}
  {isLoading && !pages.length && <div className='narr-grid'>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (<div className='ncard' key={i}><div className='meter'><i style={{ width: (20 + i * 8) + '%' }} /></div><p>Loading…</p></div>))}</div>}
  {empty && <p>No pools match this filter right now. Hit Refresh or switch to All pools.</p>}
  <div className='narr-grid' style={{marginTop:16}} key='radar-grid'>
   {coins.map((c: any) => {
    const m = c.moon >= 75 ? 'bull' : c.moon >= 58 ? 'neu' : 'bear';
    const tag = c.moon >= 75 ? 'Moon Likely' : c.moon >= 58 ? 'Watch' : c.moon >= 40 ? 'Cooling' : 'Avoid · High Risk';
    return (<a key={c.poolAddress} className='ncard' href={'/arena?pool=' + c.poolAddress} style={{ opacity: c.status === 'RISKY' ? .92 : 1 }}>
     {c.newDegen ? <span className='tag neu'>New Degen</span> : <span className={'tag ' + m}>{tag}</span>}
     <h3>${c.sym}</h3>
     <p>{c.name} · ${c.price < 0.01 ? c.price.toFixed(8) : c.price.toFixed(4)} · 24h {c.change24h >= 0 ? '+' : ''}{Number(c.change24h)?.toFixed(2)}% · Vol ${(c.volume24h / 1e6).toFixed(2)}M · Liq ${(c.liquidity / 1e3).toFixed(0)}K</p>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}><span style={{ fontSize: 12 }}>Moon score</span><b className='figure' style={{ fontSize: 20 }}>{c.moon}<span style={{ fontSize: 11 }}>/100</span></b></div>
     <div className='meter'><i style={{ width: c.moon + '%', background: c.moon >= 75 ? 'var(--color-accent-2)' : 'var(--color-accent)' }} /></div>
     {c.poolAgeH != null && <div style={{ fontSize: 11, marginTop: 6 }}>pool age {c.poolAgeH < 1 ? Math.round(c.poolAgeH * 60) + 'm' : c.poolAgeH < 48 ? c.poolAgeH.toFixed(1) + 'h' : Math.round(c.poolAgeH / 24) + 'd'} · {c.newDegen ? 'fresh launch' : c.poolAgeH > 168 ? 'established' : 'warming up'} · liq/vol {(c.volume24h / Math.max(c.liquidity, 1)).toFixed(1)}x</div>}
     <div className='meta'><span>{c.dex}</span><span style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-accent-2)', textUnderlineOffset: 3 }}>Open in arena</span></div>
    <div style={{ fontSize: 11, marginTop: 6, wordBreak: 'break-all' }} title={c.tokenAddress || ''}>CA <code>{c.tokenAddress ? c.tokenAddress.slice(0, 6) + '…' + c.tokenAddress.slice(-4) : '—'}</code></div>
    </a>);
   })}
  </div>
  <div ref={moreRef} style={{ textAlign: 'center', padding: '26px 0', minHeight: 70 }}>
   {hasMore ? (<button className='btn btn--ghost' disabled={!settled} onClick={() => settled && setSize(size + 1)}>{!settled ? 'Loading…' : 'Load 10 more'}</button>) : (<span style={{ fontSize: 13 }}>End of hype stream — refresh for new pools.</span>)}
  </div>
  <p style={{ fontSize: 12, marginTop: 4 }}>Wenits internal API · GeckoTerminal Solana trending · no CoinGecko, no backend dependency</p>
 </section>);
}
