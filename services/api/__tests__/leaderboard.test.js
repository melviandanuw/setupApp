// QA-06 Leaderboard: DB down must not crash API (regression Nov 2026).
const request=require('supertest');
process.env.JWT_SECRET='test-secret-12345678901234567890';
process.env.TOKEN_ENC_KEY='ab'.repeat(32);
process.env.X_LOGIN_REQUIRED='true';
jest.mock('../src/lib/db',()=>({query:jest.fn(),pool:{connect:jest.fn()}}));
jest.mock('../src/lib/redis',()=>({redis:{get:jest.fn(),setex:jest.fn(),del:jest.fn()}}));
const{query}=require('../src/lib/db');
const app=require('../src/index');
describe('QA-06 leaderboard resilience',()=>{
 test('DB down -> {entries:[], offline:true}, still 200',async()=>{query.mockRejectedValue(new Error('password authentication failed'));const r=await request(app).get('/board/weekly');expect(r.status).toBe(200);expect(r.body.entries).toEqual([]);expect(r.body.offline).toBe(true);});
 test('empty week -> entries []',async()=>{query.mockResolvedValue({rowCount:0,rows:[]});const r=await request(app).get('/board/weekly');expect(r.status).toBe(200);expect(r.body.entries).toEqual([]);});
 test('normal week sorted',async()=>{query.mockResolvedValueOnce({rowCount:1,rows:[{week_id:'w1'}]}).mockResolvedValueOnce({rowCount:2,rows:[{x_username:'a',equity_usd:'5',rank:1},{x_username:'b',equity_usd:'3',rank:2}]});const r=await request(app).get('/board/weekly');expect(r.status).toBe(200);expect(r.body.entries).toHaveLength(2);});
 test('L4 badges: rank1 GOLD, rank2 SILVER, rank3 BRONZE',async()=>{query.mockResolvedValueOnce({rowCount:1,rows:[{week_id:'w1'}]}).mockResolvedValueOnce({rowCount:4,rows:[{x_username:'a',equity_usd:'9',rank:1},{x_username:'b',equity_usd:'7',rank:2},{x_username:'c',equity_usd:'5',rank:3},{x_username:'d',equity_usd:'1',rank:4}]});const r=await request(app).get('/board/weekly');expect(r.body.entries[0].badge).toBe('GOLD DEGEN');expect(r.body.entries[1].badge).toBe('SILVER DEGEN');expect(r.body.entries[2].badge).toBe('BRONZE DEGEN');expect(r.body.entries[3].badge).toBeNull();expect(r.body.season.badge).toBe('season-1');});
});
