import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS sefirot (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  planet TEXT NOT NULL,
  virtue TEXT NOT NULL,
  vice TEXT,
  color TEXT NOT NULL,
  summary TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  sefira_id INTEGER NOT NULL REFERENCES sefirot(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS response_answers (
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  checked BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (response_id, question_id)
);
`;

export async function initDb(catalog: {
  slug: string;
  name: string;
  planet: string;
  virtue: string;
  vice: string | null;
  color: string;
  summary: string;
  questions: string[];
}[]) {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(SCHEMA_SQL);

  const count = await pool.query("SELECT COUNT(*)::int AS n FROM sefirot");
  if (count.rows[0].n > 0) return;

  for (const [index, sefira] of catalog.entries()) {
    const inserted = await pool.query(
      `INSERT INTO sefirot (slug, name, planet, virtue, vice, color, summary, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [
        sefira.slug,
        sefira.name,
        sefira.planet,
        sefira.virtue,
        sefira.vice,
        sefira.color,
        sefira.summary,
        index
      ]
    );
    const sefiraId = inserted.rows[0].id as number;
    for (const [qIndex, prompt] of sefira.questions.entries()) {
      await pool.query(
        `INSERT INTO questions (sefira_id, prompt, sort_order) VALUES ($1,$2,$3)`,
        [sefiraId, prompt, qIndex]
      );
    }
  }
}
