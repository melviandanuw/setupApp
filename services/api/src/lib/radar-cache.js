const Redis=require('ioredis');
const r=new Redis(process.env.REDIS_URL||'redis://127.0.0.1:6379',{maxRetriesPerRequest:1,retryStrategy:()=>null,lazyConnect:true,enableOfflineQueue:false});
r.on('error',()=>{});
const mem=new Map();
async function get(k){try{await r.connect().catch(()=>{});const v=await r.get(k);if(v!==null&&v!==undefined)return v;}catch(_){}const m=mem.get(k);if(m&&Date.now()<m.exp)return m.v;return null;}
async function setex(k,s,v){try{await r.connect().catch(()=>{});await r.setex(k,s,v);return;}catch(_){}mem.set(k,{v,exp:Date.now()+s*1000});}
async function del(k){try{await r.connect().catch(()=>{});await r.del(k);}catch(_){}mem.delete(k);}
module.exports={redis:{get,setex,del}};
