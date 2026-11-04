#!/usr/bin/env bash
set -uo pipefail
curl -s -o /dev/null -w "api:%{http_code}\n" --max-time 5 http://127.0.0.1:8080/health || true
curl -s -o /dev/null -w "web:%{http_code}\n" --max-time 8 http://localhost:3000/ || true
redis-cli ping 2>/dev/null || echo "redis:down"
