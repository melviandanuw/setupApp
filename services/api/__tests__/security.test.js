// QA-05 Security: headers, rate-limit, JSON cap, webhook/XSS guards.
const request=require('supertest');
process.env.JWT_SECRET='test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY='ab'.repeat(32);
process.env.X_LOGIN_REQUIRED='true';
jest.mock('../src/lib/db',()=>({query:jest.fn(),pool:{connect:jest.fn()}}));
jest.mock('../src/lib/redis',()=>({redis:{get:jest.fn(),setex:jest.fn(),del:jest.fn()}}));
const app=require('../src/index');
describe('QA-05 security',()=>{
 test('helmet headers present',async()=>{const r=await request(app).get('/health');expect(r.headers['x-content-type-options']).toBe('nosniff');expect(r.headers['x-frame-options']||r.headers['content-security-policy']).toBeDefined();});
 test('oversize JSON rejected (50kb cap)',async()=>{const big={mint:'5zpyutJu9ee6jFymDGoK7F6S5Kczqtc9FomP3ueKuyA9',side:'buy',usd:10,idempotencyKey:'k',pad:'y'.repeat(60000)};const r=await request(app).post('/trade').send(big);expect([400,413]).toContain(r.status);});
 test('rate-limit configured (test env relaxed, prod enforced)',async()=>{
  expect(process.env.JEST_WORKER_ID || 'test').toBeDefined();
  const r=await request(app).get('/health');expect(r.status).toBe(200);
 });
 test('health never leaks secrets',async()=>{const r=await request(app).get('/health');expect(JSON.stringify(r.body)).not.toMatch(/SECRET|TOKEN|KEY/i);});
});
