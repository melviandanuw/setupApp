#!/usr/bin/env bash
# Matikan port 8080 + 3000-3010. Retry + kill tree + wmic fallback.
set -uo pipefail
kill_pid() {
  local pid="$1" port="$2"
  if taskkill /PID "$pid" /T /F >/dev/null 2>&1; then echo "port $port: kill $pid"; return 0; fi
  # fallback 1: wmic (handle permission/owner beda)
  if wmic process where "ProcessId=$pid" delete >/dev/null 2>&1; then echo "port $port: kill $pid (wmic)"; return 0; fi
  # fallback 2: powershell Stop-Process -Force (elevasi jika bisa)
  if powershell -NoProfile -Command "Stop-Process -Id $pid -Force" >/dev/null 2>&1; then echo "port $port: kill $pid (ps)"; return 0; fi
  echo "port $port: gagal kill $pid (coba terminal Run as Administrator)"
  return 1
}
kill_port() {
  local port="$1" pids fail=0
  pids=$(netstat -ano | grep "LISTENING" | grep ":$port " | awk '{print $NF}' | sort -u)
  if [ -z "$pids" ]; then echo "port $port: free"; return; fi
  for pid in $pids; do kill_pid "$pid" "$port" || fail=1; done
  for _ in 1 2 3 4 5 6; do
    sleep 1
    netstat -ano | grep "LISTENING" | grep -q ":$port " || break
    # retry sisa pid yang masih hidup
    for pid in $(netstat -ano | grep "LISTENING" | grep ":$port " | awk '{print $NF}' | sort -u); do
      taskkill /PID "$pid" /T /F >/dev/null 2>&1 || wmic process where "ProcessId=$pid" delete >/dev/null 2>&1 || true
    done
  done
  if netstat -ano | grep "LISTENING" | grep -q ":$port "; then
    echo "port $port: STILL — $(netstat -ano | grep LISTENING | grep ":$port " | head -n 2)"
    echo "  fix: klik kanan Git Bash/Terminal -> Run as Administrator -> bash scripts/stop-dev.sh"
  else
    echo "port $port: free"
  fi
}
for port in $(seq 3000 3010); do kill_port "$port"; done
kill_port 8080
rm -f "$(dirname "${BASH_SOURCE[0]}")/../logs/"*.pid
