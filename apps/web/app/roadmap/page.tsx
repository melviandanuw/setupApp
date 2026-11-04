'use client';
const TICKER='PHASE 01 LIVE · Are you ready for some fffffffuunnn? · PHASE 01 LIVE · Are you ready for some fffffffuunnn? · ';
const PHASES=[
 {n:'01',t:'The Genesis & $WenFUN Launch',when:'Nov 2026',s:'Live now',pct:80,now:true,
  lead:'Moon Radar & Degen Arena: discover trending tokens with real-time data and practice trading in a completely risk-free environment. Jump in instantly via Practice Mode with no login required.',
  goal:'Paper trading runs smoothly, HIGH RISK tokens are flagged and blocked from the arena, the weekly board comes alive, and the $WenFUN token goes live on pump.fun.',
  scope:['Discover trending tokens with real-time data','Practice trading risk-free — Practice Mode, no login','Moon Score + Safety Gate: suspicious or highly volatile tokens flagged HIGH RISK and blocked','100% fair launch on pump.fun: $0 presale, no team buy before the public block','Creator fees flow to a transparent public treasury (infra, growth, prizes)'],
  exit:['100 test users','Week-2 retention above 20%','Zero double-spends','Trade rejections only on stale price','$WenFUN live on pump.fun, fees flowing to the published treasury'],
  cost:'$0–15/mo + token gas/rent under $5',risk:'Fake accounts, stale data, token volatility. Fix: HIGH RISK block, min 5 trades to claim, arena never depends on the token price.',
  warn:'A token launch is irreversible: once live, price, holders, and reputation are permanent. Snipers buy in the first minutes. Do not launch before the treasury wallet is set.',
  token:'Playing stays free — holding $WenFUN is never required. Fees fund gas, prizes, infra. No presale, no team buy before the public launch block.'},
 {n:'02',t:'The Arena Seasons',when:'Dec 1–20, 2026',s:'Next',pct:15,now:false,
  lead:'7-day competitive seasons where rankings come from consistent portfolio growth and risk management — not single lucky trades.',
  goal:'Season competitions that pay rewards, starting with non-cash prizes.',
  scope:['Weekly leagues: S1 Dec 1–7, S2 Dec 8–14, S3 Dec 15–20','Top performers earn Gold, Silver, and Bronze Degen badges + Hall of Fame','Strict anti-Sybil, bot-flagging, manual review before any payout'],
  exit:['2+ seasons finished','300 total participants','1-page sponsor report'],
  cost:'$0–30/mo + sponsor prizes',risk:'Reward farming. Fix: small prizes, manual claims.',
  token:'$WenFUN stays frozen as a team asset — no team sells, no token gating.'},
 {n:'03',t:'Proof of Skill & NFT Utilities',when:'Dec 21, 2026 – Jan 31, 2027',s:'Queued',pct:5,now:false,
  lead:'Season finalists receive exclusive, non-transferable NFTs as definitive, on-chain proof of trading acumen.',
  goal:'NFTs as proof of skill and a key to holder leagues — never a profit promise.',
  scope:['Soulbound achievements for finalists — no speculative pictures, no fake APY','Holder leagues, platform fee perks, voting rights for new coin listings','Metaplex standard, cheap Solana mint, offchain metadata + archive','Mainnet waits for 500 MAU — testnet first'],
  exit:['1 testnet collection','1 small mainnet drop','Utility doc + legal note'],
  cost:'Under $100 mint + RPC',risk:'Regulation, zero liquidity. Fix: non-transferable first, clear disclaimers.',
  token:'Frozen until January, except an optional holder league past 500 MAU + legal review.'},
];
export default function Roadmap(){
 return(<section style={{paddingTop:26}}>
  <style>{`@media(max-width:40rem){.rm-tl{padding-left:28px !important}.rm-node{left:-24px !important}article.tile{padding:16px !important}.rm-cta{flex-direction:column;align-items:stretch}.rm-cta a{width:100%;min-height:44px;display:inline-flex;align-items:center;justify-content:center}}
  @keyframes rm-car{0%{transform:translateX(-8%)}100%{transform:translateX(108%)}}
  @keyframes rm-car2{0%{transform:translateX(-108%)}100%{transform:translateX(8%)}}
  @keyframes rm-flick{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes rm-glow{0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.55)}50%{box-shadow:0 0 0 12px rgba(52,211,153,0)}}
  @keyframes rm-sweep{to{background-position:200% 0}}
  @keyframes rm-rise{from{opacity:0;translate:0 22px}to{opacity:1;translate:0 0}}
  @keyframes rm-blink{0%,100%{opacity:1}50%{opacity:.25}}
  @keyframes rm-drift{0%{transform:translateY(0)}100%{transform:translateY(-10px)}}
  @keyframes rm-spin{to{transform:rotate(360deg)}}
  @keyframes rm-pulse-soft{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.85}}
  .rm-reveal{opacity:0;animation:rm-rise .7s cubic-bezier(.16,1,.3,1) forwards}
  .rm-reveal[data-d="1"]{animation-delay:.1s}.rm-reveal[data-d="2"]{animation-delay:.2s}
  .rm-progress{background:linear-gradient(90deg,var(--color-accent),var(--color-accent-2),var(--color-accent));background-size:200% 100%;animation:rm-sweep 2.6s linear infinite}
  .rm-now{animation:rm-glow 2.2s ease-out infinite}
  .rm-marq{overflow:hidden;white-space:nowrap}
  .rm-marq>div{display:inline-block;padding-right:48px;animation:rm-car 24s linear infinite}
  .rm-marq2>div{animation:rm-car2 30s linear infinite}
  .rm-live{animation:rm-flick 1.6s ease-in-out infinite}
  .rm-cursor{animation:rm-blink 1.1s steps(1) infinite}
  .rm-float{animation:rm-drift 5s ease-in-out infinite alternate}
  .rm-spin-slow{animation:rm-spin 14s linear infinite}
  .rm-phase1{animation:rm-pulse-soft 2.4s ease-in-out infinite}
  .rm-tl-line{background:linear-gradient(180deg,var(--color-accent),var(--color-accent-2),var(--color-rule));background-size:100% 200%;animation:rm-sweep 6s ease-in-out infinite alternate}
  @media(prefers-reduced-motion:reduce){.rm-reveal{opacity:1;animation:none}.rm-progress,.rm-now,.rm-marq>div,.rm-live,.rm-cursor,.rm-float,.rm-tl-line,.rm-spin-slow,.rm-phase1{animation:none}}`}</style>
  <p className='tag neu' style={{position:'static',display:'inline-block',marginBottom:12}}>Nov 2026 to Jan 2027 · v1.0 Official</p>
  <h2>Wenits.fun — Official Roadmap</h2>
  <p className='lead'>Three phases, one product: Moon Radar + Degen Arena. Rewards = weekly season league. NFTs = skill badges, not speculative pictures. $WenFUN launches in Phase 1, then stays frozen as a team asset.</p>
  <div className='rm-marq tile' role='marquee' aria-label='Roadmap status ticker' style={{marginTop:16,padding:'12px 16px',fontSize:13,fontWeight:700}}>
   <div>{TICKER}{TICKER}&nbsp;</div>
  </div>
  <div className='well rm-phase1' role='status' style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',marginTop:16,padding:'12px 16px',fontSize:14}}>
   <span className='tag bull rm-live' style={{position:'static'}}>● Live now</span>
   <span><b>Phase 01 · The Genesis & $WenFUN — 80%.</b> 02 Next · 03 Queued. Playing stays free, holding never required.</span>
  </div>
  <div className='rm-tl' style={{position:'relative',marginTop:20,paddingLeft:34}}>
   <div className='rm-tl-line' aria-hidden='true' style={{position:'absolute',left:11,top:8,bottom:8,width:2,borderRadius:999,opacity:.9}}/>
   <div className='rm-grid' style={{display:'grid',gap:16}}>
   {PHASES.map((p,i)=>(
    <article key={p.n} className='tile rm-reveal' data-d={i} style={{padding:22,position:'relative',overflow:'hidden'}}>
     <span aria-hidden='true' style={{position:'absolute',right:-46,top:-46,width:130,height:130,borderRadius:'50%',border:'2px dashed var(--color-rule)',opacity:.5}} className='rm-spin-slow'/>
     <span className='rm-node rm-float' aria-hidden='true' style={{position:'absolute',left:-31,top:26,width:14,height:14,borderRadius:'50%',background:p.now?'var(--color-mint)':p.s==='Next'?'var(--color-accent)':'var(--color-paper-3)',border:'2px solid var(--color-rule)',boxShadow:p.now?'0 0 12px var(--color-mint)':'none',animationDelay:(i*1.3)+'s'}}/>
     <div style={{display:'flex',gap:10,alignItems:'baseline',flexWrap:'wrap'}}>
      <span className='figure' style={{fontSize:40}}>{p.n}</span>
      <span className={'tag '+(p.now?'bull':'neu')+(p.now?' rm-now':'')} style={{position:'static'}}>{p.s}</span>
      <span style={{marginLeft:'auto',fontSize:12,opacity:.8}}>{p.when}<span className='rm-cursor'>_</span></span>
     </div>
     <h3 style={{margin:'10px 0 4px'}}>{p.t}</h3>
     <p style={{fontSize:14,margin:'0 0 8px',fontStyle:'italic'}}>{p.lead}</p>
     <p style={{fontSize:14,margin:'0 0 12px'}}>{p.goal}</p>
     <ul style={{fontSize:13,margin:'0 0 12px',paddingLeft:18,lineHeight:1.6}}>
      {p.scope.map(s=>(<li key={s}>{s}</li>))}
     </ul>
     <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span>Progress · Phase {p.n}</span><b className='figure'>{p.pct}%</b></div>
     <div className='meter' role='progressbar' aria-valuenow={p.pct} aria-valuemin={0} aria-valuemax={100} aria-label={'Phase '+p.n+' progress'}><i className='rm-progress' style={{width:p.pct+'%',background:p.now?'':'var(--color-accent-2)'}}/></div>

    </article>))}
   </div>
  </div>
  <div className='tile rm-marq rm-marq2' style={{marginTop:16,padding:'12px 16px',fontSize:12,opacity:.85}} aria-hidden='true'>
   <div>NO PRESALE · NO TEAM BUY · TREASURY PUBLIC · PRACTICE MODE FREE · RETENTION &gt; 20% · ZERO DOUBLE-SPEND · NO PRESALE · NO TEAM BUY · TREASURY PUBLIC · PRACTICE MODE FREE · RETENTION &gt; 20% · ZERO DOUBLE-SPEND ·&nbsp;</div>
  </div>

  <div className='rm-cta' style={{marginTop:22,display:'flex',gap:12,flexWrap:'wrap'}}>
   <a className='btn btn--primary' href='/arena'>Trade while we ship</a>
   <a className='btn' href='/radar'>Scan the hype</a>
  </div>
 </section>);
}
