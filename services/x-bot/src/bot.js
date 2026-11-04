#!/usr/bin/env node
// Wenits X bot: auto posting + auto comment.
// node src/bot.js [--once] [--dry-run]
// Env: X_BEARER_TOKEN (search), X_USER_ACCESS_TOKEN (post), X_USER_ID (opsional, auto via /users/me),
//   POST_INTERVAL_MIN=120, COMMENT_INTERVAL_MIN=60, MAX_POST_DAY=6, MAX_COMMENT_DAY=15,
//   COMMENT_KEYWORDS="solana memecoin,memecoin trading", PROMO_URL, X_API_BASE.
require('dotenv').config();
const x = require('./lib/x');
const store = require('./lib/store');
const { fetchNews, buildPost, buildComment } = require('./lib/content');

const ARGS = new Set(process.argv.slice(2));
const ONCE = ARGS.has('--once');
const DRY = ARGS.has('--dry-run');

const CFG = {
  bearer: process.env.X_BEARER_TOKEN || '',
  userToken: process.env.X_USER_ACCESS_TOKEN || '',
  postMin: parseInt(process.env.POST_INTERVAL_MIN || '120', 10),
  cmtMin: parseInt(process.env.COMMENT_INTERVAL_MIN || '60', 10),
  maxPost: parseInt(process.env.MAX_POST_DAY || '6', 10),
  maxCmt: parseInt(process.env.MAX_COMMENT_DAY || '15', 10),
  keywords: (process.env.COMMENT_KEYWORDS || 'solana memecoin,pump fun,solana trading').split(',').map(s => s.trim()).filter(Boolean),
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(`[x-bot ${new Date().toISOString()}]`, ...a);

async function doPost(st) {
  const day = store.dayCount(st.postsToday);
  if (day.n >= CFG.maxPost) return 'cap';
  if (Date.now() - st.lastPostTs < CFG.postMin * 60 * 1000) return 'wait';
  const news = await fetchNews(8).catch(() => []);
  let text = buildPost(news);
  if (st.postedTexts.includes(text)) text = buildPost([]); // hindari duplikat verbatim
  if (DRY) { log('DRY post:', text); return 'dry'; }
  if (!CFG.userToken) { log('SKIP post: X_USER_ACCESS_TOKEN kosong'); return 'notoken'; }
  const r = await x.postTweet(text, CFG.userToken);
  st.lastPostTs = Date.now(); day.n++; st.postedTexts.push(text);
  log('posted', r?.data?.id, '|', text.slice(0, 60));
  return 'ok';
}

async function doComment(st) {
  const day = store.dayCount(st.commentsToday);
  if (day.n >= CFG.maxCmt) return 'cap';
  if (Date.now() - st.lastCommentTs < CFG.cmtMin * 60 * 1000) return 'wait';
  if (!CFG.bearer) { log('SKIP comment: X_BEARER_TOKEN kosong'); return 'notoken'; }
  const kw = st._kw || 0;
  const q = CFG.keywords[kw % CFG.keywords.length];
  st._kw = kw + 1;
  const res = await x.searchRecent(q, CFG.bearer, 10);
  const fresh = (res.data || []).filter(t => !st.commentedIds.includes(t.id));
  if (!fresh.length) return 'empty';
  const target = fresh[0];
  const text = buildComment();
  if (DRY) { log('DRY comment ->', target.id, ':', text); st.commentedIds.push(target.id); return 'dry'; }
  if (!CFG.userToken) { log('SKIP reply: X_USER_ACCESS_TOKEN kosong'); return 'notoken'; }
  const r = await x.postTweet(text, CFG.userToken, target.id);
  st.lastCommentTs = Date.now(); day.n++; st.commentedIds.push(target.id);
  log('commented', r?.data?.id, '->', target.id, '|', text.slice(0, 60));
  return 'ok';
}

async function doReplies(st) {
  if (!CFG.userToken) return 'notoken';
  let me = process.env.X_USER_ID || '';
  try { if (!me) me = (await x.getMe(CFG.userToken))?.data?.id || ''; } catch { return 'nome'; }
  if (!me) return 'nome';
  if (Date.now() - (st.lastMentionTs || 0) < 5 * 60 * 1000) return 'wait';
  const res = await x.getMentions(me, CFG.userToken, st.mentionSinceId || undefined).catch(() => null);
  const items = (res?.data || []).filter(t => String(t.author_id) !== String(me) && !st.commentedIds.includes(t.id));
  if (!items.length) { st.lastMentionTs = Date.now(); if (res?.meta?.newest_id) st.mentionSinceId = res.meta.newest_id; return 'empty'; }
  const target = items[0];
  const text = buildComment();
  if (DRY) { log('DRY reply ->', target.id, ':', text); st.commentedIds.push(target.id); st.mentionSinceId = target.id; return 'dry'; }
  const r = await x.postTweet(text, CFG.userToken, target.id);
  st.commentedIds.push(target.id); st.mentionSinceId = target.id; st.lastMentionTs = Date.now();
  log('replied', r?.data?.id, '->', target.id);
  return 'ok';
}

async function cycle() {
  const st = store.load();
  try {
    const p = await doPost(st);
    if (p !== 'wait' && p !== 'cap') log('post:', p);
  } catch (e) { log('post ERR:', e.message); if (!e.retryable) await sleep(5000); }
  try {
    const c = await doComment(st);
    if (c !== 'wait' && c !== 'cap') log('comment:', c);
  } catch (e) { log('comment ERR:', e.message); }
  try {
    const m = await doReplies(st);
    if (m !== 'wait' && m !== 'cap' && m !== 'empty' && m !== 'notoken') log('mention:', m);
  } catch (e) { log('mention ERR:', e.message); }
  store.save(st);
}

async function main() {
  log(`start once=${ONCE} dry=${DRY} postMin=${CFG.postMin} cmtMin=${CFG.cmtMin} maxPost=${CFG.maxPost} maxCmt=${CFG.maxCmt}`);
  if (!CFG.bearer && !CFG.userToken) log('WARN: token kosong semua — isi .env dulu (lihat .env.example)');
  await cycle();
  if (ONCE) return;
  for (;;) { await sleep(5 * 60 * 1000); await cycle(); } // cek tiap 5 mnt, interval dijaga state
}
main().catch(e => { console.error(e); process.exit(1); });
