const ex=require('express');const crypto=require('crypto');const{redis}=require('../lib/redis');const{query}=require('../lib/db');const{pkce,enc}=require('../lib/crypto');const{signSession}=require('../middleware/auth');const{xFetch,checkFollow}=require('../lib/x');
const R = ex.Router();
const xOff = (req, res, next) => String(process.env.X_LOGIN_REQUIRED || 'false').toLowerCase() === 'true' ? next() : res.status(404).json({ error: 'X_LOGIN_DISABLED' });
const CK = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' };
R.get('/x/login', xOff, (req, res) => { const st = crypto.randomBytes(16).toString('hex'); const { v, c } = pkce(); redis.setex(`oauth:${st}`, 600, JSON.stringify({ v })); res.cookie('oauth_state', st, { ...CK, maxAge: 600000 }); const u = new URL('https://twitter.com/i/oauth2/authorize'); u.searchParams.set('client_id', process.env.X_CLIENT_ID); u.searchParams.set('redirect_uri', process.env.X_REDIRECT_URI); u.searchParams.set('response_type', 'code'); u.searchParams.set('scope', 'users.read follows.read offline.access'); u.searchParams.set('state', st); u.searchParams.set('code_challenge', c); u.searchParams.set('code_challenge_method', 'S256'); res.redirect(u.toString()); });
R.get('/x/callback', xOff, async (req, res) => { try {const{code,state,error}=req.query;if(error)return res.redirect(process.env.FRONTEND_URL+'/denied?reason='+encodeURIComponent(error));if(!code||!state||state!==req.cookies?.oauth_state)return res.status(400).json({error:'BAD_STATE'});
const raw=await redis.get(`oauth:${state}`);if(!raw)return res.status(400).json({error:'STATE_EXPIRED'});
await redis.del(`oauth:${state}`);res.clearCookie('oauth_state',{path:'/'});
const{ v }=JSON.parse(raw);
const tok=await(await fetch('https://api.x.com/2/oauth2/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:process.env.X_REDIRECT_URI,client_id:process.env.X_CLIENT_ID,code_verifier:v}),signal:AbortSignal.timeout(10000)})).json();
if(!tok.access_token)return res.status(400).json({error:'TOKEN_EXCHANGE_FAILED'});
const me=await xFetch('https://api.x.com/2/users/me',tok.access_token);
let follows=false;try{follows=await checkFollow(me.data.id,tok.access_token);}catch(e){follows=false;}
const ex1=await query('SELECT id FROM users WHERE x_user_id=$1',[me.data.id]);let uid;
if(ex1.rowCount){uid=ex1.rows[0].id;await query('UPDATE users SET x_username=$1,x_access_token_enc=$2,x_refresh_token_enc=$3,is_gated=$4,last_follow_check=now() WHERE id=$5',[me.data.username,enc(tok.access_token),tok.refresh_token?enc(tok.refresh_token):null,!follows,uid]);}
else{const ins=await query("INSERT INTO users(x_user_id,x_username,x_access_token_enc,x_refresh_token_enc,is_gated,last_follow_check) VALUES($1,$2,$3,$4,$5,now()) RETURNING id",[me.data.id,me.data.username,enc(tok.access_token),tok.refresh_token?enc(tok.refresh_token):null,!follows]);uid=ins.rows[0].id;await query('INSERT INTO portfolios(user_id) VALUES($1) ON CONFLICT DO NOTHING',[uid]);}
await redis.setex(`follow:${uid}`,300,follows?'1':'0');
res.cookie('wenits',signSession(uid),{...CK,maxAge:12*3600*1000});
res.redirect(process.env.FRONTEND_URL+(follows?'/arena':'/gated'));}
catch(e){console.error(e);res.status(500).json({error:'CALLBACK_FAILED'});}});
R.get('/x/follow-status', xOff, require('../middleware/auth').requireAuth, async (req, res) => {try{const c=await redis.get(`follow:${req.uid}`);if(c!==null)return res.json({following:c==='1',cached:true});
const u=await query('SELECT x_user_id,x_access_token_enc FROM users WHERE id=$1',[req.uid]);if(!u.rowCount)return res.status(404).json({error:'NO_USER'});
const{dec}=require('../lib/crypto');
let f=false;try{f=await checkFollow(u.rows[0].x_user_id,dec(u.rows[0].x_access_token_enc));}catch(e){return res.status(502).json({error:'X_API_FAILED'});}
await query('UPDATE users SET is_gated=$1,last_follow_check=now() WHERE id=$2',[!f,req.uid]);await redis.setex(`follow:${req.uid}`,300,f?'1':'0');res.json({following:f,cached:false});}catch(e){console.error('follow-status',e.message);res.status(503).json({error:'DB_UNAVAILABLE'});}});
R.post('/logout',(req,res)=>{res.clearCookie('wenits',{path:'/'});res.json({ok:true});});
module.exports=R;
