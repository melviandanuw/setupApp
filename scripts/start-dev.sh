#!/usr/bin/env bash
# Wenits.fun dev: api :8080 + scraper + web :3000. Aman jalan 2x.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/logs"; mkdir -p "$LOG"
port_up() { netstat -ano | grep "LISTENING" | grep -q ":$1 "; }
probe() { local tmp="$LOG/.probe.$$"; local code; code=$(curl -s -o "$tmp" -w "%{http_code}" --max-time "$2" "$1" 2>/dev/null) || true; rm -f "$tmp"; echo "${code:-000}"; }
if port_up 8080; then echo "api      : already :8080"; else
  echo "api      : start (log: logs/api.log)"
  ( cd "$ROOT/services/api" || exit 1; [ -f .env ] || cp .env.example .env; nohup node src/index.js > "$LOG/api.log" 2>&1 & echo $! > "$LOG/api.pid" )
fi
if port_up 6379; then echo "redis    : ok :6379"; else echo "redis    : NOT listening — start redis-server dulu"; fi
if [ "${X_LOGIN_REQUIRED:-false}" = "true" ]; then echo "x-login  : ON"; else echo "x-login  : OFF (dev, arena tanpa login)"; fi
if port_up 3000; then echo "web      : already :3000"; else
  echo "web      : start (log: logs/web.log, compile pertama ~30s)"
  ( cd "$ROOT/apps/web" || exit 1; [ -d node_modules ] || npm i; [ -f .env.local ] || cp .env.example .env.local 2>/dev/null || true; nohup npm run dev > "$LOG/web.log" 2>&1 & echo $! > "$LOG/web.pid" )
fi
if [ "${WITH_WRITER:-1}" = "1" ]; then
  echo "writer   : start (log: logs/writer.log, harga px:* tiap 60s)"
  ( cd "$ROOT/services/api" || exit 1; nohup node src/jobs/price-writer.js > "$LOG/writer.log" 2>&1 & echo $! > "$LOG/writer.pid" )
else echo "writer   : skip (WITH_WRITER=0 untuk matikan)"; fi
if [ "${WITH_SCRAPER:-0}" = "1" ]; then
  echo "scraper  : start (log: logs/scraper.log)"
  ( cd "$ROOT/services/ai-scraper" || exit 1; nohup python scraper.py > "$LOG/scraper.log" 2>&1 & echo $! > "$LOG/scraper.pid" )
else echo "scraper  : skip (WITH_SCRAPER=1 untuk nyalakan)"; fi
echo "waiting health..."
api=000; for _ in $(seq 1 30); do api=$(probe http://127.0.0.1:8080/health 4); [ "$api" = "200" ] && break; sleep 2; done
ui=000; for _ in $(seq 1 30); do ui=$(probe http://localhost:3000/ 8); [ "$ui" = "200" ] && break; sleep 3; done
echo "api : $api -> http://127.0.0.1:8080/health"
echo "web : $ui  -> http://localhost:3000"
echo "logs: $LOG/"
[ "$api" = "200" ] && [ "$ui" = "200" ] && exit 0
echo "cek logs/"; exit 1
