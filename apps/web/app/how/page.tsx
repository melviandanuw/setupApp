export default function How(){
 const STEPS=[
  ['Scan the hype','Open Moon Radar. Each pool carries a moon score 0-100 from 24h momentum plus volume and liquidity. Fresh pools pay big and rug big. Established pools move slow.'],
  ['Pick a pool','Open the arena, choose from Hype now or paste any radar pool. The chart shows real hourly candles. Check CA, pool age, liq-to-volume before sizing.'],
  ['Send it','Set USD size, hit Buy or Sell. Double-click safe: idempotency key means one fill. Stale price over 15s rejects the trade, no silent bad fill.'],
  ['Climb the board','Equity = cash + positions at live price. Weekly board ranks top 100. Min 5 trades to claim a badge. Over 50 trades a day flags manual review.'],
 ];
 return(<section style={{paddingTop:26}}>
  <p className='tag neu' style={{position:'static',display:'inline-block',marginBottom:12}}>Guide</p>
  <h2>How to play</h2>
  <p className='lead'>Four moves. No KYC. Zero real losses. $10,000 fantasy cash per run.</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:16,marginTop:24}}>
   {STEPS.map(([t,d],i)=>(
    <div key={t} className='tile rm-reveal' data-d={i} style={{padding:22}}>
     <div style={{display:'flex',gap:10,alignItems:'baseline'}}>
      <span className='figure' style={{fontSize:40}}>0{i+1}</span>
     </div>
     <h3 style={{margin:'10px 0 4px'}}>{t}</h3>
     <p style={{fontSize:14,margin:0}}>{d}</p>
    </div>))}
  </div>
  <div className='tile' style={{marginTop:16,padding:18}}>
   <b>Risk notes</b>
   <ul style={{margin:'8px 0 0',paddingLeft:18,fontSize:14,lineHeight:1.7}}>
    <li>Volatile badge = wild pool. Size small or skip.</li>
    <li>Moon score is momentum + liquidity math, not advice.</li>
    <li>Sample board shows until Postgres is live, then real equity ranks.</li>
   </ul>
  </div>
  <div style={{marginTop:22,display:'flex',gap:12,flexWrap:'wrap'}}>
   <a className='btn btn--primary' href='/arena'>Enter the arena</a>
   <a className='btn' href='/radar'>Scan the radar</a>
  </div>
 </section>);
}
