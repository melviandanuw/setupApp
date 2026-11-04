// QA-07 Crypto: AES-256-GCM roundtrip, PKCE shape, key validation.
process.env.TOKEN_ENC_KEY='ab'.repeat(32);
const{enc,dec,pkce}=require('../src/lib/crypto');
describe('QA-07 crypto',()=>{
 test('enc/dec roundtrip',()=>{const c=enc('hello-token');expect(c.split(':')).toHaveLength(3);expect(dec(c)).toBe('hello-token');});
 test('same plaintext -> different ciphertext (random IV)',()=>{expect(enc('x')).not.toBe(enc('x'));});
 test('tampered tag fails',()=>{const c=enc('x').split(':');c[1]='00'.repeat(16);expect(()=>dec(c.join(':'))).toThrow();});
 test('pkce verifier 43+ chars, challenge urlsafe',()=>{const{v,c}=pkce();expect(v.length).toBeGreaterThanOrEqual(43);expect(c).toMatch(/^[A-Za-z0-9_-]+$/);});
 test('missing key throws clean error',()=>{const old=process.env.TOKEN_ENC_KEY;delete process.env.TOKEN_ENC_KEY;expect(()=>enc('x')).toThrow('TOKEN_ENC_KEY_MISSING');process.env.TOKEN_ENC_KEY=old;});
});
