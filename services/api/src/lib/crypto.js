const crypto = require('crypto');
function getKey() {
  const hex = process.env.TOKEN_ENC_KEY;
  if (!hex) throw new Error('TOKEN_ENC_KEY_MISSING');
  return Buffer.from(hex, 'hex');
}
function enc(t) { const KEY = getKey(); const iv = crypto.randomBytes(12); const c = crypto.createCipheriv('aes-256-gcm', KEY, iv); const e = Buffer.concat([c.update(t, 'utf8'), c.final()]); return iv.toString('hex') + ':' + c.getAuthTag().toString('hex') + ':' + e.toString('hex'); }
function dec(s) { const KEY = getKey(); const [a, b, d] = s.split(':'); const dd = crypto.createDecipheriv('aes-256-gcm', KEY, Buffer.from(a, 'hex')); dd.setAuthTag(Buffer.from(b, 'hex')); return Buffer.concat([dd.update(Buffer.from(d, 'hex')), dd.final()]).toString('utf8'); }
const pkce=()=>{const v=crypto.randomBytes(32).toString('base64url');const ch=crypto.createHash('sha256').update(v).digest('base64url');return{v,c:ch};};
module.exports={enc,dec,pkce};
