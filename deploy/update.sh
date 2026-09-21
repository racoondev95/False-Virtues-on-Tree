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

echo "==> Rebuild + restart containere"
"${COMPOSE[@]}" up -d --build --remove-orphans

echo "==> Aștept /api/health"
ok=0
for attempt in $(seq 1 45); do
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

echo "==> Curăț imagini dangling"
docker image prune -f >/dev/null || true

echo "==> Servicii"
"${COMPOSE[@]}" ps
echo "Deploy OK."
