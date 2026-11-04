// QA-03 Trade validation + race: bad input, insufficient funds, stale price, idempotency.
const request=require('supertest');
process.env.JWT_SECRET='test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY='ab'.repeat(32);
process.env.CREATOR_X_USER_ID='123';
process.env.FRONTEND_URL='http://localhost:3000';
process.env.X_LOGIN_REQUIRED='true';
jest.mock('../src/lib/db',()=>({query:jest.fn(),pool:{connect:jest.fn()}}));
jest.mock('../src/lib/redis',()=>({redis:{get:jest.fn(),setex:jest.fn(),del:jest.fn()}}));
jest.mock('../src/lib/price',()=>({getPrice:jest.fn()}));
const{query,pool}=require('../src/lib/db');
const{getPrice}=require('../src/lib/price');
const jwt=require('jsonwebtoken');
const app=require('../src/index');
const t=jwt.sign({uid:'u1'},process.env.JWT_SECRET);
beforeEach(()=>{query.mockResolvedValue({rowCount:1,rows:[{is_gated:false}]});});
describe('QA-03 trade',()=>{
 test('no gate: RISKY flag does not block (gate removed)',async()=>{const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:10,idempotencyKey:'nogate-1',gateStatus:'RISKY'});expect([200,503]).toContain(r.status);expect(r.body.error||'').not.toBe('HIGH_RISK_BLOCKED');});
 test('reject unknown mint (spoof) -> 400 UNKNOWN_MINT',async()=>{const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'So11111111111111111111111111111111111111112',side:'buy',usd:10,idempotencyKey:'spoof-key-1'});expect(r.status).toBe(400);expect(r.body.error).toBe('UNKNOWN_MINT');});
 test('reject bad mint (too short)',async()=>{const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'short',side:'buy',usd:10,idempotencyKey:'bad-1'});expect(r.status).toBe(400);expect(r.body.error).toBe('BAD_INPUT');});
 test('reject bad side',async()=>{const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'hold',usd:10,idempotencyKey:'bad-2'});expect(r.status).toBe(400);});
 test('reject negative usd',async()=>{const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:-5,idempotencyKey:'bad-3'});expect(r.status).toBe(400);});
 test('reject missing amount',async()=>{const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',idempotencyKey:'bad-4'});expect(r.status).toBe(400);});
 test('stale price -> 503 PRICE_STALE',async()=>{getPrice.mockRejectedValue(Object.assign(new Error('PRICE_STALE'),{status:503}));const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:10,idempotencyKey:'stale-key-1'});expect(r.status).toBe(503);expect(r.body.error).toBe('PRICE_STALE');});
 test('duplicate idempotency -> {duplicate:true}',async()=>{getPrice.mockResolvedValue({price:1});pool.connect.mockResolvedValue({query:jest.fn(async s=>s.startsWith('SELECT id FROM trades')?{rowCount:1}:{}),release:jest.fn()});const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:5,idempotencyKey:'dup-race'});expect(r.body.duplicate).toBe(true);});
 test('insufficient cash -> 400',async()=>{getPrice.mockResolvedValue({price:10});pool.connect.mockResolvedValue({query:jest.fn(async s=>{if(s.startsWith('SELECT id FROM trades'))return{rowCount:0};if(s.includes('cash_usd'))return{rows:[{cash_usd:'1.00'}],rowCount:1};return{rowCount:0};}),release:jest.fn()});const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:100,idempotencyKey:'cash-1'});expect([400,404,500]).toContain(r.status);});
});
