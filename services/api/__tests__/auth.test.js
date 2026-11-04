// QA-01 Auth & session: JWT valid/invalid/expired, cookie handling.
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
const good=jwt.sign({uid:'u1'},process.env.JWT_SECRET);
const bad=jwt.sign({uid:'u1'},'wrong-secret-12345678901234567890');
describe('QA-01 auth session',()=>{
 test('no cookie -> 401 NO_SESSION',async()=>{const r=await request(app).get('/auth/x/follow-status');expect(r.status).toBe(401);expect(r.body.error).toBe('NO_SESSION');});
 test('bad signature -> 401 BAD_SESSION',async()=>{const r=await request(app).get('/auth/x/follow-status').set('Cookie',`wenits=${bad}`);expect(r.status).toBe(401);});
 test('expired token -> 401',async()=>{const t=jwt.sign({uid:'u1'},process.env.JWT_SECRET,{expiresIn:'-1s'});const r=await request(app).get('/auth/x/follow-status').set('Cookie',`wenits=${t}`);expect(r.status).toBe(401);});
 test('valid token + cached follow true',async()=>{redis.get.mockResolvedValue('1');const r=await request(app).get('/auth/x/follow-status').set('Cookie',`wenits=${good}`);expect(r.status).toBe(200);expect(r.body.following).toBe(true);expect(r.body.cached).toBe(true);});
 test('logout clears cookie',async()=>{const r=await request(app).post('/auth/logout');expect(r.status).toBe(200);expect((r.headers['set-cookie']||[]).join('')).toMatch(/wenits=/);});
});
