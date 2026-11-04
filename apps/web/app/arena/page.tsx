'use client';
import useSWR from 'swr';
import {useEffect,useRef,useState} from 'react';
import {createChart,IChartApi,ISeriesApi,CandlestickData,CandlestickSeries} from 'lightweight-charts';
const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:8080';
const fet=(u:string)=>fetch(u,{credentials:'include'}).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok) throw Object.assign(new Error(j.error||('HTTP '+r.status)),{status:r.status});return j;});
const pub=(u:string)=>fetch(u).then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok) throw Object.assign(new Error(j.error||('HTTP '+r.status)),{status:r.status});return j;});
const OFF=process.env.NEXT_PUBLIC_X_LOGIN_REQUIRED!=='true';
function CA({addr}:{addr:string}){
 const[cp,setCp]=useState(false);
 if(!addr) return null;
 const short=addr.slice(0,4)+'…'+addr.slice(-4);
 return(<span style={{fontSize:12,display:'inline-flex',gap:6,alignItems:'center'}} title={addr}>CA <code>{short}</code><button onClick={(e)=>{e.preventDefault();try{navigator.clipboard.writeText(addr);setCp(true);setTimeout(()=>setCp(false),1200);}catch(err){}}} style={{background:'transparent',border:'1px solid var(--color-muted)',color:'inherit',cursor:'pointer',fontSize:11,padding:'2px 8px'}}>{cp?'copied':'copy'}</button><a href={'https://solscan.io/token/'+addr} target='_blank' rel='noreferrer' style={{textDecoration:'underline',textDecorationColor:'var(--color-accent-2)',textUnderlineOffset:3}} onClick={e=>e.stopPropagation()}>solscan</a></span>);
}
function CoinIcon({c}:{c:any}){
 const[err,setErr]=useState(false);
 const fb='https://api.dicebear.com/9.x/shapes/svg?seed='+encodeURIComponent(c.sym||'?');
 if(c.image&&!err) return(<img src={c.image} alt='' style={{width:40,height:40}} onError={()=>setErr(true)}/>);
 return(<img src={fb} alt='' style={{width:40,height:40}}/>);
}
function PoolChart({pool}:{pool:string}){
 const ref=useRef<HTMLDivElement>(null);
 const[chartErr,setChartErr]=useState('');
 const{data,error,mutate}=useSWR(pool?('/api/pool?pool='+pool):null,pub,{refreshInterval:15000,shouldRetryOnError:true,errorRetryInterval:15000,onError:()=>{},dedupingInterval:10000,revalidateOnFocus:false,keepPreviousData:true});
 const chartRef=useRef<IChartApi|null>(null);
 const seriesRef=useRef<ISeriesApi<'Candlestick'>|null>(null);
 useEffect(()=>{
  if(!ref.current) return;
  let alive=true;
  try{
   const ch=createChart(ref.current,{width:ref.current.clientWidth||600,height:340,layout:{background:{color:'transparent'},textColor:'#9fb3c8'},grid:{vertLines:{color:'#22d3ee22'},horzLines:{color:'#22d3ee22'}},rightPriceScale:{borderColor:'#22d3ee44'},timeScale:{borderColor:'#22d3ee44'},crosshair:{vertLine:{labelBackgroundColor:'#22d3ee'},horzLine:{labelBackgroundColor:'#22d3ee'}}});
   const s=ch.addSeries(CandlestickSeries,{upColor:'#22d3ee',downColor:'#e879f9',wickUpColor:'#22d3ee',wickDownColor:'#e879f9',borderVisible:false,priceFormat:{type:'price',precision:8,minMove:0.00000001}});
   chartRef.current=ch; seriesRef.current=s;
  }catch(e:any){ if(alive) setChartErr('Chart error: '+(e?.message||'init failed')); }
  const onR=()=>{try{chartRef.current?.applyOptions({width:ref.current!.clientWidth});}catch(e){}};
  window.addEventListener('resize',onR);
  return()=>{alive=false;window.removeEventListener('resize',onR);try{chartRef.current?.remove();}catch(e){} chartRef.current=null; seriesRef.current=null;};
 },[pool]);
 useEffect(()=>{
  if(!seriesRef.current||!chartRef.current) return;
  try{
   if(data?.candles?.length){
    seriesRef.current.setData(data.candles as CandlestickData[]);
    chartRef.current.timeScale().fitContent();
    setChartErr('');
   }
  }catch(e:any){ setChartErr('Chart error: '+(e?.message||'setData failed')); }
 },[pool,(data as any)?.updatedAt]);
 return(<div style={{position:'relative',height:340}}>
  <div ref={ref} style={{height:340}}/>
  {!data&&!error&&<div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',color:'var(--color-muted)'}}>Loading live pool chart…</div>}
  {chartErr&&<div style={{position:'absolute',left:8,top:8,color:'var(--color-accent)',fontSize:12}}>{chartErr}</div>}
  {error&&!data&&<div style={{position:'absolute',inset:0,display:'grid',placeItems:'center',gap:8,alignContent:'center',color:'var(--color-accent)'}}>Chart feed is rate-limited.<button onClick={()=>mutate()} style={{background:'transparent',border:'1px solid var(--color-muted)',color:'inherit',padding:'8px 16px',cursor:'pointer'}}>Retry chart</button></div>}
 </div>);
}
export default function Arena(){
 const{data:mk,error:isErr,isLoading}=useSWR('/api/coins?page=1',pub,{refreshInterval:120000,shouldRetryOnError:true,errorRetryInterval:10000,dedupingInterval:30000,onError:()=>{}});
 const coins=(mk?.coins||[]).filter((c:any)=>!c.error&&c.price>0);
 const params=typeof window!=='undefined'?new URLSearchParams(window.location.search):null;
 const initPool=params?.get('pool');
 const[ci,setCi]=useState(0);
 useEffect(()=>{if(initPool&&coins.length){const i=coins.findIndex((c:any)=>c.poolAddress===initPool);if(i>=0) setCi(i);}// eslint-disable-next-line
 },[(mk as any)?.updatedAt]);
 const coin=coins[Math.min(ci,Math.max(coins.length-1,0))];
 const[usd,setUsd]=useState('10');
 const[msg,setMsg]=useState('');
 const[busy,setBusy]=useState(false);
 const{data:pf,mutate:mpf}=useSWR(API+'/trade/portfolio',fet,{refreshInterval:5000,shouldRetryOnError:false,onError:()=>{}});
 const{data:bd}=useSWR(API+'/board/weekly',fet,{refreshInterval:15000,shouldRetryOnError:false,onError:()=>{}});
 const positions:any[]=pf?.positions||[];
 const cash=pf?.cash??'10,000.00';
 const posMints=positions.map((p:any)=>p.mint).join(',');
 const{data:px}=useSWR(posMints?('/api/prices?mints='+encodeURIComponent(posMints)):null,pub,{refreshInterval:15000,shouldRetryOnError:false,onError:()=>{},dedupingInterval:10000});
 async function trade(side:'buy'|'sell'){
  if(busy||!coin) return; setBusy(true); setMsg('sending…');
  const key=(crypto as any).randomUUID?(crypto as any).randomUUID():String(Date.now())+Math.random();
  try{
   const r=await fetch(API+'/trade',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({mint:coin.poolAddress||coin.id,side,usd:parseFloat(usd)||0,idempotencyKey:key,gateStatus:'PASS'})});
   const j=await r.json().catch(()=>({}));
   if(r.ok){setMsg(side.toUpperCase()+' OK @ '+j.price+' ('+j.notional+' USD)');}
   else{
    const code=j.error||('HTTP '+r.status);
    const hint=code==='DB_UNAVAILABLE'?' — database offline, trading paused':code==='PRICE_STALE'||code==='PRICE_UNAVAILABLE'?' — price feed is stale, retry in a minute':code==='HIGH_RISK_BLOCKED'?' — risky token blocked by Safety Gate':code==='UNKNOWN_MINT'?' — unknown pool, pick from the Hype now list':'';
    setMsg('FAILED: '+code+hint);
   }
   mpf();
  }catch(e:any){setMsg('FAILED: network — API unreachable.');}
  setBusy(false);
 }
 return(<>
 <section style={{paddingTop:26}}>
  <h2>Degen Arena</h2>
  <p className='lead'>Pick a live Solana pool, set a USD size, hit Buy or Sell. Real pool candles, fantasy money.</p>
  {isLoading&&!mk&&<p style={{color:'var(--color-muted)'}}>Connecting to live hype…</p>}
  {isErr&&!mk&&<p style={{color:'var(--color-accent)'}}>Market unreachable — retrying.</p>}
  <div className='arena'>
   <div className='tile' style={{padding:12,maxHeight:600,overflowY:'auto'}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Hype now</div>
    {coins.length===0&&<p style={{fontSize:13}}>No pools loaded yet — open the radar.</p>}
    {coins.map((c:any,i:number)=>{const on=coin&&c.poolAddress===coin.poolAddress;const ch=c.change24h||0;const hi=(c.moon??0)>=58;
     return(<button key={c.poolAddress} className={'coin'+(on?' on':'')} onClick={()=>setCi(i)} aria-current={on?'true':undefined} title={(c.verdict||'Moon score')+' '+c.moon+'/100'}>
      <span className='rk'>{String(i+1).padStart(2,'0')}</span>
      <span className='ic'><CoinIcon c={c}/></span>
      <span className='nm'><b>${c.sym}</b><span className='sub'>{c.name}</span>{c.moon!=null&&<span className='mb'><span className='track'><i style={{width:c.moon+'%',background:c.moon>=75?'var(--color-accent-2)':'var(--color-accent)'}}/></span><em>{c.moon}</em></span>}</span>
      <span className='pr'><b>{c.price<0.01?'$'+c.price.toFixed(6):'$'+Number(c.price).toFixed(4)}</b><span className={ch>=0?'up':'dn'}>{ch>=0?'+':''}{Number(ch).toFixed(2)}%</span></span>
     </button>);})}
    <p style={{fontSize:12,marginTop:8}}>More hype on the <a href='/radar' style={{textDecoration:'underline',textDecorationColor:'var(--color-accent-2)',textUnderlineOffset:3}}>radar page</a>.</p>
   </div>
   <div>
    <div className='tile' style={{padding:16}}>
     {coin?<>
     <div style={{display:'flex',alignItems:'baseline',gap:12,flexWrap:'wrap'}}>
      <span className='figure' style={{fontSize:40,color:'var(--color-ink)'}}>${coin.price<0.01?coin.price.toFixed(8):Number(coin.price).toFixed(4)}</span>
      <b className={(coin.change24h||0)>=0?'up':'dn'}>{(coin.change24h||0)>=0?'+':''}{Number(coin.change24h||0).toFixed(2)}% 24h</b>
      <span style={{color:'var(--color-muted)'}}>${coin.sym} / USD · {coin.name}</span>
      {coin?.verdict&&<span className='tag neu' style={{position:'static'}}>{coin.verdict} · {coin.moon}</span>}
      <span style={{marginLeft:'auto',fontSize:13}}>Cash <b>${cash}</b></span>
     </div>
     <div style={{display:'flex',gap:10,alignItems:'center',marginTop:6,flexWrap:'wrap'}}>
      <CA addr={coin?.tokenAddress||''}/>
      <span style={{fontSize:12}}>pool <code>{String(coin?.poolAddress||'').slice(0,4)}…{String(coin?.poolAddress||'').slice(-4)}</code></span>
     </div>
     <div style={{marginTop:8}}><PoolChart pool={coin.poolAddress}/><div style={{fontSize:11,opacity:.65,marginTop:4}}>Live chart · refreshes every 15s · fallback feed when GT rate-limits</div></div>
     </>:<div style={{color:'var(--color-muted)'}}>Waiting for hype feed…</div>}
     <div style={{display:'flex',gap:8,alignItems:'end',flexWrap:'wrap',marginTop:12}}>
      <label style={{fontSize:13}}>Size (USD)<input className='field' style={{maxWidth:200,marginTop:4}} value={usd} onChange={e=>setUsd(e.target.value)} inputMode='decimal' placeholder='10' /></label>
      <span style={{fontSize:13,paddingBottom:14}}>Double-click safe — one order per click.</span>
     </div>
     <div className='pressrow' style={{marginTop:12}}>
      <button className='press press--buy' disabled={busy} title='Buy' onClick={()=>trade('buy')}>Buy / Long</button>
      <button className='press press--sell' disabled={busy} title='Sell' onClick={()=>trade('sell')}>Sell</button>
     </div>
     <div className='msg'>{msg}</div>
    </div>
   </div>
   <div>
    <div className='tile' style={{padding:16}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Weekly leaderboard</div>
     <div style={{position:'relative'}}>
      <div style={{filter:'blur(3px)',opacity:.55,pointerEvents:'none',userSelect:'none'}} aria-hidden='true'>
       {([{x_username:'degenking',equity_usd:'24,310'},{x_username:'wenitsmaxi',equity_usd:'19,870'},{x_username:'solchad',equity_usd:'15,204'},{x_username:'you',equity_usd:'10,000'}]).map((e:any,i:number)=>(<div className='lrow' key={i}><span className='rk'>#{i+1}</span><span style={{flex:1}}>@{e.x_username||'anon'}</span><b>${e.equity_usd}</b></div>))}
      </div>
      <div style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><span className='tag neu' style={{position:'static',fontSize:13}}>Not live in Beta</span></div>
     </div>
    </div>
    <div className='tile' style={{padding:16,marginTop:14}}><div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Your positions</div>
     {positions.length===0&&<p style={{fontSize:13}}>No positions yet — your first buy shows up here.</p>}
     {positions.map((p:any,i:number)=>{
      const q=parseFloat(p.qty||'0'); const avg=parseFloat(p.avg_entry||'0');
      const meta=(px&&px.prices&&px.prices[p.mint])||null;
      const live=meta?.price||(coins.find((c:any)=>c.poolAddress===p.mint||c.id===p.mint)?.price)||avg;
      const val=q*live; const pnl=avg>0?((live-avg)/avg*100):0;
      const fmtQ=q>=1e6?(q/1e6).toFixed(2)+'M':q>=1e3?(q/1e3).toFixed(2)+'K':q>=1? q.toFixed(2):q.toPrecision(3);
      return(<div key={i} style={{padding:'10px 0',borderBottom:'1px solid var(--color-rule)'}}>
       <div style={{display:'flex',alignItems:'center',gap:8}}>
        {meta?.image&&<img src={meta.image} alt='' style={{width:22,height:22,borderRadius:'50%'}}/>}
        <b style={{fontSize:14}} title={p.mint}>{meta?.sym||p.mint.slice(0,4)+'…'+p.mint.slice(-4)}</b>
        <span style={{fontSize:11,opacity:.7,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{meta?.name||''}</span>
        <span style={{marginLeft:'auto',fontSize:13,fontWeight:800}}>${val<0.01?val.toFixed(4):val.toFixed(2)}</span>
       </div>
       <div style={{display:'flex',gap:10,fontSize:12,opacity:.8,marginTop:2}}>
        <span>qty {fmtQ}</span><span>avg ${avg<0.01?avg.toFixed(8):avg.toFixed(4)}</span>
        <span className={pnl>=0?'up':'dn'} style={{marginLeft:'auto',fontWeight:700}}>{pnl>=0?'+':''}{pnl.toFixed(1)}%</span>
       </div>
      </div>);})}
    </div>
   </div>
  </div>
 </section>
 </>);}
