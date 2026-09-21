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

## Deploy automat pe AWS (merge în `master`)

La fiecare push/merge pe `master`, GitHub Actions copiază proiectul pe instanța EC2, reconstruiește containerele și le repornește. Schema și catalogul de întrebări se aplică la start-ul API (`initDb` în `api/src/db.ts`).

### 1. Pregătire instanță (o singură dată)

Pe Ubuntu 24.04, ca root sau cu `sudo`:

```bash
# instalează Docker + swap (vezi deploy/ec2-setup.sh)
curl -fsSL https://raw.githubusercontent.com/racoondev95/False-Virtues-on-Tree/master/deploy/ec2-setup.sh | sudo bash
```

Apoi, ca user `ubuntu`:

```bash
mkdir -p /home/ubuntu/chestionar-kabbalah
# .env rămâne doar pe server, nu e în git
nano /home/ubuntu/chestionar-kabbalah/.env
```

Completează `.env` după `.env.example` (`POSTGRES_PASSWORD`, `SITE_ADDRESS`, `PUBLIC_URL`).

Generează o cheie de deploy (pe calculatorul tău, nu pe instanță):

```bash
ssh-keygen -t ed25519 -f kabbalah-ec2-deploy -N ""
```

Pune `kabbalah-ec2-deploy.pub` în `/home/ubuntu/.ssh/authorized_keys` pe EC2. Security Group: SSH (22) de pe GitHub nu e o listă IP fixă — lasă 22 deschis doar cu autentificare pe cheie, plus 80/443 public.

### 2. Secrets în GitHub

Repo → **Settings → Secrets and variables → Actions**:

| Secret        | Valoare                                      |
|---------------|----------------------------------------------|
| `EC2_HOST`    | IP public sau DNS al instanței               |
| `EC2_USER`    | `ubuntu`                                     |
| `EC2_SSH_KEY` | conținutul complet al fișierului **privat** `kabbalah-ec2-deploy` |

Directorul pe server e `/home/ubuntu/chestionar-kabbalah` (vezi `APP_DIR` în `.github/workflows/deploy.yml`).

### 3. Primul deploy

Poți rula workflow-ul manual: **Actions → Deploy pe AWS EC2 → Run workflow**. După aceea, fiecare merge în `master` face același lucru: `rsync` (fără să șteargă `.env`) + `deploy/update.sh`.

Deploy manual pe instanță, dacă e nevoie:

```bash
bash /home/ubuntu/chestionar-kabbalah/deploy/update.sh
```
