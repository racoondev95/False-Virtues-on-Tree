# Chestionar Kabbalah

Aplicație pentru **Falsele Virtuți ale Arborelui Vieții**: formular pe sefirot, salvare în Postgres și vizualizare pe Arborele Vieții.

## Servicii Docker

Containerele sunt izolate de alte proiecte: rețea `kabbalah-net`, volum `kabbalah_pgdata`, Postgres pe portul **5434**.

- `kabbalah-postgres`
- `kabbalah-api`
- `kabbalah-web`

## Mediu local (watch, fără frontend în Docker)

1. Pornește doar baza: `npm run db:up`
2. API cu watch: `npm run dev` (din rădăcină) sau `npm run dev` în `api/`
3. Frontend local: în `frontend/` rulează `npm run dev`  
   Folosește `.env.development` (`VITE_API_URL=http://localhost:4002/api`) și Vite HMR pe http://localhost:5173

## Deploy (totul în Docker)

Din `frontend/`:

```bash
npm run deploy
```

sau din rădăcină: `npm run deploy`.

Frontend-ul de producție folosește `.env.production` (`VITE_API_URL=/api`), nginx proxiază `/api` către containerul API.

Aplicația: http://localhost:8080  
API: http://localhost:4002/api/health
