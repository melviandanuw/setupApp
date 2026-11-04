// X API v2 client. Bearer = search/read app-level. UserToken = OAuth2 user (post/reply).
const BASE = process.env.X_API_BASE || 'https://api.x.com/2';

async function req(method, path, { bearer, userToken, params, body } = {}) {
  const u = new URL(BASE + path);
  if (params) for (const [k, v] of Object.entries(params)) if (v != null) u.searchParams.set(k, v);
  const token = userToken || bearer;
  if (!token) throw new Error('X_NO_TOKEN (isi X_USER_ACCESS_TOKEN / X_BEARER_TOKEN di .env)');
  const r = await fetch(u.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      'User-Agent': 'WenitsXBot/1.0',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  if (r.status === 429) {
    const reset = r.headers.get('x-rate-limit-reset');
    const e = new Error(`X_RATE_LIMIT reset=${reset || '?'}`);
    e.retryable = true; e.reset = reset;
    throw e;
  }
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    const e = new Error(`X_API_${r.status} ${t.slice(0, 200)}`);
    e.status = r.status; e.retryable = r.status >= 500;
    throw e;
  }
  return r.json();
}

const getMe = (userToken) => req('GET', '/users/me', { userToken });
const postTweet = (text, userToken, replyTo) =>
  req('POST', '/tweets', { userToken, body: replyTo ? { text, reply: { in_reply_to_tweet_id: replyTo } } : { text } });
const searchRecent = (query, bearer, max = 10) =>
  req('GET', '/tweets/search/recent', { bearer, params: { query: `${query} -is:retweet -is:reply lang:en`, max_results: Math.min(max, 100), 'tweet.fields': 'author_id,created_at,public_metrics' } });
const getMentions = (userId, userToken, sinceId) =>
  req('GET', `/users/${userId}/mentions`, { userToken, params: { since_id: sinceId, max_results: 20, 'tweet.fields': 'author_id,created_at' } });

module.exports = { req, getMe, postTweet, searchRecent, getMentions };
