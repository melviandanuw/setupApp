'use client';
import useSWR from 'swr';
const fet=(u:string)=>fetch(u).then(r=>{if(!r.ok) throw 0;return r.json();});
export default function Home(){
 const{data}=useSWR('/api/coins?page=1',fet,{refreshInterval:120000,shouldRetryOnError:false,onError:()=>{},dedupingInterval:60000});
 const coins=(data?.coins||[]).filter((c:any)=>!c.error);
 const top5=[...coins].sort((a:any,b:any)=>b.moon-a.moon).slice(0,5);
 return(<>
 <section className='hero'>
  <div>
   <h1>Trade memes. Zero ruin.</h1>
   <p className='lead' style={{margin:'16px 0 24px'}}>Track live Solana hype and practice with $10,000 fantasy cash. No login, no real money, no ruin.</p>
   <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
    <a className='btn btn--primary' href='/arena'>Enter Degen Arena</a>
    <a className='btn' href='/radar'>Open Moon Radar</a>
   </div>
   <div className='scoreband' style={{marginTop:32}}>
    <div className='fact'><div className='figure' style={{fontSize:32}}>$10K</div><div style={{fontSize:13}}>fantasy cash per run</div></div>
    <div className='fact'><div className='figure' style={{fontSize:32}}>LIVE</div><div style={{fontSize:13}}>Solana hype pools</div></div>
    <div className='fact'><div className='figure' style={{fontSize:32}}>TOP 100</div><div style={{fontSize:13}}>weekly board seats</div></div>
   </div>
  </div>
  <div className='tile' style={{padding:20}}>
   <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Hype right now · top {top5.length}</div>
   {!data&&<p style={{color:'var(--color-muted)'}}>Scanning live pools…</p>}
   {top5.map((c:any,i:number)=>(<a key={c.id} href={'/arena?pool='+c.poolAddress} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 4px',borderTop:i?'1px solid var(--color-rule)':'0',textDecoration:'none',color:'inherit'}}>
    <span className='figure' style={{fontSize:28,minWidth:64}}>{c.moon}</span>
    <span style={{flex:1,minWidth:0}}><b style={{fontSize:16}}>${c.sym}</b><span style={{display:'block',fontSize:13,color:'var(--color-muted)'}}>{c.change24h>=0?'+':''}{Number(c.change24h)?.toFixed(1)}% in 24h</span></span>
    <span aria-hidden='true' style={{fontSize:18,color:'var(--color-accent-2)'}}>›</span>
   </a>))}
   <div style={{marginTop:12}}><a className='btn' style={{width:'100%'}} href='/radar'>Full hype radar →</a></div>
  </div>
 </section>
 <style>{`@keyframes home-marq{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}@media(prefers-reduced-motion:reduce){.home-marq>div{animation:none}}`}</style>
 <section style={{padding:'8px 0 40px'}}>
  <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
   <div style={{flex:'1 1 220px',minWidth:0}}><h2>How to play</h2>
   <p className='lead'>Three moves. No KYC. Zero real losses.</p></div>
   <div className='tile home-marq' aria-hidden='true' style={{overflow:'hidden',whiteSpace:'nowrap',padding:'10px 14px',fontSize:13,fontWeight:700,maxWidth:200,flex:'0 1 200px'}}><div style={{display:'inline-flex',gap:32,paddingRight:32,animation:'home-marq 8s linear infinite',willChange:'transform'}}><span>FUNNNNNN · FUNNNNNN ·&nbsp;</span><span>FUNNNNNN · FUNNNNNN ·&nbsp;</span></div></div>
  </div>
  <div className='narr-grid' style={{marginTop:20}}>
   <div className='tile' style={{padding:22}}><div className='figure' style={{fontSize:40}}>01</div><h3 style={{margin:'8px 0'}}>Scan the hype</h3><p style={{color:'var(--color-muted)',fontSize:14,margin:0}}>Real Solana trending pools plus a moon score. Practice reading hype before risking anything.</p></div>
      <div className='tile' style={{padding:22}}><div className='figure' style={{fontSize:40}}>02</div><h3 style={{margin:'8px 0'}}>Send it in the arena</h3><p style={{color:'var(--color-muted)',fontSize:14,margin:0}}>Buy and sell with $10,000 fantasy cash. Double-click safe — one order per click.</p></div>
      <div className='tile' style={{padding:22}}><div className='figure' style={{fontSize:40}}>03</div><h3 style={{margin:'8px 0'}}>Climb the ranks</h3><p style={{color:'var(--color-muted)',fontSize:14,margin:0}}>The biggest paper equity each week takes the Top 100.</p></div>
  </div>
  <div style={{marginTop:22}}><a className='btn btn--primary' href='/arena'>Start practicing</a></div>
 </section>
 </>);}
