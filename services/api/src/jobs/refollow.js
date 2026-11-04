const{query}=require('../lib/db');const{dec}=require('../lib/crypto');const{checkFollow}=require('../lib/x');const{redis}=require('../lib/redis');
async function sweep(){const r=await query("SELECT id,x_user_id,x_access_token_enc FROM users WHERE last_follow_check < now()-interval '30 minutes' LIMIT 50");for(const u of r.rows){try{const f=await checkFollow(u.x_user_id,dec(u.x_access_token_enc));await query('UPDATE users SET is_gated=$1,last_follow_check=now() WHERE id=$2',[!f,u.id]);await redis.setex(`follow:${u.id}`,300,f?'1':'0');}catch(e){console.error('refollow',u.id,e.message);}}}
if(require.main===module){sweep().then(()=>process.exit(0));}else setInterval(sweep,30*60*1000);
module.exports={sweep};
