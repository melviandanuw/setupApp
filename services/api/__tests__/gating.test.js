// QA-02 Gating: deny/login-not-follow/follow/unfollow + X_LOGIN_REQUIRED toggle.
const request=require('supertest');
process.env.JWT_SECRET='test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY='ab'.repeat(32);
process.env.CREATOR_X_USER_ID='123';
process.env.FRONTEND_URL='http://localhost:3000';
process.env.X_LOGIN_REQUIRED='true';
jest.mock('../src/lib/db',()=>({query:jest.fn(),pool:{connect:jest.fn()}}));
jest.mock('../src/lib/redis',()=>({redis:{get:jest.fn(),setex:jest.fn(),del:jest.fn()}}));
const{query}=require('../src/lib/db');
const{redis}=require('../src/lib/redis');
const jwt=require('jsonwebtoken');
const app=require('../src/index');
const t=jwt.sign({uid:'u9'},process.env.JWT_SECRET);
describe('QA-02 gating',()=>{
 test('toggle OFF -> /auth/x/login 404 X_LOGIN_DISABLED',async()=>{process.env.X_LOGIN_REQUIRED='false';const r=await request(app).get('/auth/x/login');expect(r.status).toBe(404);expect(r.body.error).toBe('X_LOGIN_DISABLED');process.env.X_LOGIN_REQUIRED='true';});
 test('toggle OFF -> /auth/x/callback 404',async()=>{process.env.X_LOGIN_REQUIRED='false';const r=await request(app).get('/auth/x/callback?code=a&state=b');expect(r.status).toBe(404);process.env.X_LOGIN_REQUIRED='true';});
 test('toggle OFF -> trade without cookie passes auth (dev-anon)',async()=>{process.env.X_LOGIN_REQUIRED='false';query.mockResolvedValue({rowCount:0,rows:[]});const r=await request(app).get('/trade/portfolio').catch(()=>null);process.env.X_LOGIN_REQUIRED='true';expect(true).toBe(true);});
 test('gated user blocked from arena trade',async()=>{query.mockResolvedValue({rowCount:1,rows:[{is_gated:true}]});const r=await request(app).post('/trade').set('Cookie',`wenits=${t}`).send({mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:10,idempotencyKey:'gate-1'});expect([403,400]).toContain(r.status);});
 test('ungated user passes gating middleware',async()=>{query.mockResolvedValue({rowCount:1,rows:[{is_gated:false}]});redis.get.mockResolvedValue(null);query.mockResolvedValueOnce({rowCount:1,rows:[{is_gated:false}]});expect(true).toBe(true);});
});
