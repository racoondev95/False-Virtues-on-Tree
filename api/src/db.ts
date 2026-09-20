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

  for (const [index, sefira] of catalog.entries()) {
    const upserted = await pool.query(
      `INSERT INTO sefirot (slug, name, planet, virtue, vice, color, summary, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         planet = EXCLUDED.planet,
         virtue = EXCLUDED.virtue,
         vice = EXCLUDED.vice,
         color = EXCLUDED.color,
         summary = EXCLUDED.summary,
         sort_order = EXCLUDED.sort_order
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
    const sefiraId = upserted.rows[0].id as number;

    const existing = await pool.query(
      `SELECT id, sort_order FROM questions WHERE sefira_id = $1 ORDER BY sort_order, id`,
      [sefiraId]
    );

    for (const [qIndex, prompt] of sefira.questions.entries()) {
      const row = existing.rows[qIndex] as { id: number; sort_order: number } | undefined;
      if (row) {
        await pool.query(`UPDATE questions SET prompt = $1, sort_order = $2 WHERE id = $3`, [
          prompt,
          qIndex,
          row.id
        ]);
      } else {
        await pool.query(`INSERT INTO questions (sefira_id, prompt, sort_order) VALUES ($1,$2,$3)`, [
          sefiraId,
          prompt,
          qIndex
        ]);
      }
    }

    if (existing.rows.length > sefira.questions.length) {
      const keepIds = existing.rows.slice(0, sefira.questions.length).map((r) => r.id as number);
      await pool.query(`DELETE FROM questions WHERE sefira_id = $1 AND NOT (id = ANY($2::int[]))`, [
        sefiraId,
        keepIds
      ]);
    }
  }
}
