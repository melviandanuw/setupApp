const Redis=require('ioredis');
const redis=new Redis(process.env.REDIS_URL,{maxRetriesPerRequest:2});
module.exports={redis};
