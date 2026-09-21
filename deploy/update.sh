#!/usr/bin/env bash
# Rebuild și restart pe instanța EC2 după ce fișierele au fost actualizate.
# Schema Postgres se aplică la start-ul API (initDb).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPOSE=(docker compose -f docker-compose.prod.yml)

if [[ ! -f .env ]]; then
  echo "Lipsește $ROOT/.env — copiază .env.example și completează parolele / SITE_ADDRESS."
  exit 1
fi

echo "==> Spațiu disc înainte de curățare"
df -h / | tail -1 || true
docker system df || true

echo "==> Eliberez spațiu Docker (păstrez volumele cu date: Postgres/Caddy)"
docker builder prune -af >/dev/null || true
docker image prune -af >/dev/null || true
docker container prune -f >/dev/null || true
# Nu șterge volumele denumite (kabbalah_pgdata, caddy_*) — doar dangling
docker volume prune -f >/dev/null || true

echo "==> Spațiu disc după curățare"
df -h / | tail -1 || true

echo "==> Rebuild + restart containere (serial, ca să nu umple discul)"
export COMPOSE_PARALLEL_LIMIT=1
"${COMPOSE[@]}" up -d --build --remove-orphans

echo "==> Aștept /api/health"
ok=0
for attempt in $(seq 1 60); do
  if "${COMPOSE[@]}" exec -T api node -e "fetch('http://127.0.0.1:4000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    ok=1
    break
  fi
  sleep 2
done

if [[ "$ok" -ne 1 ]]; then
  echo "Health check eșuat. Ultimele loguri:"
  "${COMPOSE[@]}" logs --tail=80 api web caddy
  exit 1
fi

echo "==> Curăț build cache rămas"
docker builder prune -af >/dev/null || true
docker image prune -f >/dev/null || true

echo "==> Servicii"
"${COMPOSE[@]}" ps
df -h / | tail -1 || true
echo "Deploy OK."
