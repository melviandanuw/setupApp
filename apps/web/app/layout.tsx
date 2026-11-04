import './globals.css';
export const metadata={title:'Wenits.fun — Degen Arena & Trend Tracker',description:'Paper trade real Solana memecoins. Moon radar. Zero real losses.',icons:{icon:'/logo/W_logo_blue.png'}};
export default function Root({children}:{children:React.ReactNode}){
return(<html lang='en'><head>
<link rel='preconnect' href='https://fonts.googleapis.com'/>
<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous'/>
<link href='https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap' rel='stylesheet'/>
</head><body>
<nav className='nav'>
<span style={{display:'inline-flex',alignItems:'center',gap:6}}><img className='logo' src='/logo/Wenitsfun_logo_landscape_w.png' alt='Wenits.fun'/><span style={{fontFamily:'var(--font-outlier)',fontSize:10,fontWeight:700,letterSpacing:'.08em',color:'var(--color-accent-ink)',background:'var(--color-accent)',borderRadius:'999px',padding:'2px 8px',lineHeight:1.4,transform:'translateY(-6px)'}}>BETA</span></span>
<div className='links'><a href='/'>Home</a><a href='/radar'>Moon Radar</a><a href='/arena'>Degen Arena</a><a href='/roadmap'>Roadmap</a><a href='/how'>How to Play</a></div>
<span style={{marginLeft:'auto'}}><a className='btn' style={{padding:'9px 18px',fontSize:14}} href='/arena'>Enter Arena</a></span>
</nav>
<div className='wrap'>{children}
<footer>Wenits.fun · Solana paper trading · fantasy money, no real value · not financial advice · prices by GeckoTerminal + DexScreener</footer>
</div></body></html>);}
