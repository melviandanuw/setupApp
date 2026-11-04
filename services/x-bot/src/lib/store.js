// JSON file state: jadwal, id yg sudah dipost/komen (hindari duplikat).
const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', '..', 'data', 'state.json');

function blank() {
  return { lastPostTs: 0, lastCommentTs: 0, lastMentionTs: 0, postsToday: { d: '', n: 0 }, commentsToday: { d: '', n: 0 }, commentedIds: [], postedTexts: [], mentionSinceId: null };
}
function today() { return new Date().toISOString().slice(0, 10); }
function load() {
  try { return { ...blank(), ...JSON.parse(fs.readFileSync(FILE, 'utf8')) }; }
  catch { return blank(); }
}
function save(s) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  s.commentedIds = (s.commentedIds || []).slice(-500);
  s.postedTexts = (s.postedTexts || []).slice(-50);
  fs.writeFileSync(FILE, JSON.stringify(s, null, 2));
}
function dayCount(slot) { // reset otomatis tiap hari
  const t = today();
  if (slot.d !== t) { slot.d = t; slot.n = 0; }
  return slot;
}
module.exports = { load, save, dayCount, today };
