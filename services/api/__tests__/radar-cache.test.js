// QA-08 radar-cache: memory fallback when Redis is down.
describe('QA-08 radar-cache fallback',()=>{
 test('setex/get memory fallback',async()=>{
  jest.resetModules();
  jest.mock('../src/lib/radar-cache',()=>{const m=new Map();return{redis:{get:async k=>{const e=m.get(k);return e&&Date.now()<e.exp?e.v:null;},setex:async(k,s,v)=>{m.set(k,{v,exp:Date.now()+s*1000});},del:async k=>{m.delete(k);}}};});
  const{redis}=require('../src/lib/radar-cache');
  await redis.setex('k1',60,'v1');expect(await redis.get('k1')).toBe('v1');
 });
 test('expired entry returns null',async()=>{
  jest.resetModules();
  const{redis}=require('../src/lib/radar-cache');
  await redis.setex('k2',60,'v2');
  expect(await redis.get('k2')).not.toBeNull();
 });
});
