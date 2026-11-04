// Sumber konten: crypto news RSS + promo wenits.fun + template komentar.
const SITE = process.env.PROMO_URL || 'https://wenits.fun';

const FEEDS = [
  'https://cointelegraph.com/rss',
  'https://www.coindesk.com/arc/outboundfeeds/rss/',
];

const PROMOS = [
  (h) => `Paper trade memecoin tanpa rugi beneran. Coba arena gratis di ${SITE} 🎮`,
  (h) => `Hype radar Solana — pantau token rame sebelum telat. ${SITE} 📡`,
  (h) => `Latihan trading degen, saldo virtual, leaderboard beneran. ${SITE} 🏆`,
];

const COMMENTS = [
  (t) => `Menarik. Kami rangkum hype kayak gini tiap hari di ${SITE} 📡`,
  (t) => `Setuju. Btw paper-trade dulu biar aman sebelum entry beneran — ${SITE} 🎮`,
  (t) => `Insight bagus. Kami track sentimen token rame di ${SITE}, mampir 👍`,
  (t) => `Valid. Kalau mau latihan entry tanpa risiko, arena gratis di ${SITE} 🏆`,
];

function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

async function fetchNews(count = 8) {
  const out = [];
  for (const f of FEEDS) {
    try {
      const r = await fetch(f, { headers: { 'User-Agent': 'WenitsXBot/1.0' }, signal: AbortSignal.timeout(15000) });
      if (!r.ok) continue;
      const xml = await r.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, count);
      for (const m of items) {
        const title = (m[1].match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1];
        const link = (m[1].match(/<link>([\s\S]*?)<\/link>/) || [])[1];
        if (title) out.push({ title: title.replace(/<[^>]+>/g, '').trim().slice(0, 120), link: (link || '').trim() });
      }
    } catch { /* feed mati = skip, coba feed berikut */ }
  }
  return out.slice(0, count);
}

function buildPost(news) {
  // 60% news rewrite, 40% promo. Jagat panjang 280 char.
  if (news.length && Math.random() < 0.6) {
    const n = pick(news);
    const cands = [
      `📰 ${n.title}\n\nPantau sentimen token rame di ${SITE} 📡`,
      `Crypto update: ${n.title}\n\nLatihan entry tanpa rugi di ${SITE} 🎮`,
    ];
    return pick(cands).slice(0, 280);
  }
  return pick(PROMOS)().slice(0, 280);
}

function buildComment() { return pick(COMMENTS)().slice(0, 280); }

module.exports = { fetchNews, buildPost, buildComment, SITE };
