// QA-04 Market: DexScreener pair mapping, moon score bounds, cache SWR, chart validation.
const request=require('supertest');
process.env.JWT_SECRET='test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY='ab'.repeat(32);
process.env.X_LOGIN_REQUIRED='true';
jest.mock('../src/lib/db',()=>({query:jest.fn(),pool:{connect:jest.fn()}}));
jest.mock('../src/lib/redis',()=>({redis:{get:jest.fn(),setex:jest.fn(),del:jest.fn()}}));
jest.mock('../src/lib/radar-cache',()=>({redis:{get:jest.fn(),setex:jest.fn(),del:jest.fn()}}));
const app=require('../src/index');
const rc=require('../src/lib/radar-cache').redis;
const realFetch=global.fetch;
afterEach(()=>{global.fetch=realFetch;jest.clearAllMocks();});
function dsPair(price){return{priceUsd:String(price),priceChange:{h1:1,h6:2,h24:3},volume:{h24:100000},liquidity:{usd:1000000},fdv:5000000,dexId:'orca',url:'https://x',info:{imageUrl:null}};}
describe('QA-04 market',()=>{
 test('7 coins mapped, moon 2..99, sorted desc',async()=>{
  rc.get.mockResolvedValue(null);
  global.fetch=jest.fn(async url=>({ok:true,status:200,json:async()=>({pairs:[dsPair(0.01)]})}));
  const r=await request(app).get('/market/coins');
  expect(r.status).toBe(200);
  expect(r.body.coins).toHaveLength(7);
  const ids=r.body.coins.map(c=>c.id).sort();
  expect(ids).toEqual(['BOME','BONK','JUP','MYRO','PENGU','POPCAT','SLERF'].sort());
  for(const c of r.body.coins){expect(c.moon).toBeGreaterThanOrEqual(2);expect(c.moon).toBeLessThanOrEqual(99);expect(c.price).toBeGreaterThan(0);}
  const moons=r.body.coins.map(c=>c.moon);
  expect([...moons].sort((a,b)=>b-a)).toEqual(moons);
 });
 test('cache hit instant + background refresh flag',async()=>{
  rc.get.mockResolvedValue(JSON.stringify({updatedAt:new Date().toISOString(),source:'x',coins:[]}));
  global.fetch=jest.fn(async()=>({ok:true,status:200,json:async()=>({pairs:[dsPair(1)]})}));
  const r=await request(app).get('/market/coins');
  expect(r.status).toBe(200);expect(r.body.cached).toBe(true);
 });
 test('DexScreener down, no cache -> 200 with all error:true (degraded, not crash)',async()=>{
  rc.get.mockResolvedValue(null);
  global.fetch=jest.fn(async()=>{throw new Error('down');});
  const r=await request(app).get('/market/coins');
  expect(r.status).toBe(200);
  expect(r.body.coins.every((c)=>c.error)).toBe(true);
 });
 test('chart unknown coin -> 400',async()=>{const r=await request(app).get('/market/chart/FAKE?days=7');expect(r.status).toBe(400);});
 test('chart cached passthrough',async()=>{
  const rc2=require('../src/lib/radar-cache').redis;
  rc2.get.mockResolvedValue(JSON.stringify({id:'BONK',days:'7',candles:[{time:1,open:1,high:1,low:1,close:1}],updatedAt:new Date().toISOString()}));
  const r=await request(app).get('/market/chart/BONK?days=7');
  expect(r.status).toBe(200);expect(r.body.cached).toBe(true);
 });
});
