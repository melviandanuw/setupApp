'use client';
import {useState} from 'react';
import './globals.css';
function Nav(){
 const[open,setOpen]=useState(false);
 return(<nav className='nav'>
<a href='/' aria-label='Wenits.fun home' style={{display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none'}}><img className='logo' src='/logo/Wenitsfun_logo_landscape_w.png' alt='Wenits.fun'/><span style={{fontFamily:'var(--font-outlier)',fontSize:10,fontWeight:700,letterSpacing:'.08em',color:'var(--color-accent-ink)',background:'var(--color-accent)',borderRadius:'999px',padding:'2px 8px',lineHeight:1.4,transform:'translateY(-6px)'}}>BETA</span></a>
<button className='nav-burger' aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(o=>!o)} style={{marginLeft:'auto',background:'none',backgroundColor:'transparent',border:'0',outline:'none',boxShadow:'none',WebkitAppearance:'none',appearance:'none',width:40,height:40,padding:8,cursor:'pointer',color:'inherit',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><svg width='18' height='18' viewBox='0 0 18 18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>{open?(<><line x1='4' y1='4' x2='14' y2='14'/><line x1='14' y1='4' x2='4' y2='14'/></>):(<><line x1='2' y1='4.5' x2='16' y2='4.5'/><line x1='2' y1='9' x2='16' y2='9'/><line x1='2' y1='13.5' x2='16' y2='13.5'/></>)}</svg></button>
<div className={'links'+(open?' open':'')}><a href='/'>Home</a><a href='/radar'>Moon Radar</a><a href='/arena'>Degen Arena</a><a href='/roadmap'>Roadmap</a><a href='/how'>How to Play</a><a className='btn nav-cta' style={{padding:'9px 18px',fontSize:14,textAlign:'center'}} href='/arena'>Enter Arena</a></div>
<style>{`@media(min-width:56rem){.nav-burger{display:none}.nav .nav-cta{display:none}.nav .links{display:flex !important}}@media(max-width:55.99rem){.nav{flex-wrap:wrap}.nav .links{display:none;width:100%;flex-direction:column;gap:4px;margin-top:8px}.nav .links.open{display:flex}.nav .links a{padding:12px 16px;fontSize:15px}.nav .nav-cta{margin-top:4px}}`}</style>
</nav>);
}
export default function Root({children}:{children:React.ReactNode}){
return(<html lang='en'><head>
<title>Wenits.fun — Degen Arena & Trend Tracker</title>
<meta name='description' content='Paper trade real Solana memecoins. Moon radar. Zero real losses.'/>
<link rel='icon' href='/logo/W_logo_blue.png'/>
<link rel='preconnect' href='https://fonts.googleapis.com'/>
<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous'/>
<link href='https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap' rel='stylesheet'/>
</head><body>
<Nav/>
<div className='wrap'>{children}
<footer>Wenits.fun · Solana paper trading · fantasy money, no real value · not financial advice · prices by GeckoTerminal + DexScreener</footer>
</div></body></html>);}
