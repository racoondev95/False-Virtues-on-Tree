import cors from "cors";
import express from "express";
import { INTRO, SEFIROT } from "./catalog.js";
import { initDb, pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: corsOrigin.split(",").map((s) => s.trim()) }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/questionnaire", async (_req, res) => {
  const sefirot = await pool.query(
    `SELECT id, slug, name, planet, virtue, vice, color, summary, sort_order
     FROM sefirot ORDER BY sort_order`
  );
  const questions = await pool.query(
    `SELECT id, sefira_id, prompt, sort_order FROM questions ORDER BY sefira_id, sort_order`
  );

  const payload = sefirot.rows.map((sefira) => ({
    ...sefira,
    questions: questions.rows.filter((q) => q.sefira_id === sefira.id)
  }));

  res.json({ intro: INTRO, sefirot: payload });
});

app.post("/api/responses", async (req, res) => {
  const participantName =
    typeof req.body?.participantName === "string" ? req.body.participantName.trim() : "";
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

  const questionRows = await pool.query(`SELECT id FROM questions`);
  const validIds = new Set(questionRows.rows.map((r) => r.id as number));
  const checkedIds = new Set<number>();

  for (const item of answers) {
    const id = Number(item?.questionId);
    if (!validIds.has(id)) continue;
    if (item?.checked === true) checkedIds.add(id);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const created = await client.query(
      `INSERT INTO responses (participant_name) VALUES ($1) RETURNING id, created_at, participant_name`,
      [participantName || null]
    );
    const responseId = created.rows[0].id as string;

    for (const id of validIds) {
      await client.query(
        `INSERT INTO response_answers (response_id, question_id, checked) VALUES ($1,$2,$3)`,
        [responseId, id, checkedIds.has(id)]
      );
    }
    await client.query("COMMIT");
    const result = await loadResult(responseId);
    res.status(201).json(result);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Nu am putut salva răspunsul." });
  } finally {
    client.release();
  }
});

app.get("/api/responses/:id", async (req, res) => {
  const result = await loadResult(req.params.id);
  if (!result) {
    res.status(404).json({ error: "Răspunsul nu a fost găsit." });
    return;
  }
  res.json(result);
});

async function loadResult(id: string) {
  const response = await pool.query(
    `SELECT id, participant_name, created_at FROM responses WHERE id = $1`,
    [id]
  );
  if (!response.rowCount) return null;

  const rows = await pool.query(
    `SELECT
       s.slug, s.name, s.planet, s.virtue, s.vice, s.color, s.summary, s.sort_order,
       q.id AS question_id, q.prompt, ra.checked
     FROM sefirot s
     JOIN questions q ON q.sefira_id = s.id
     JOIN response_answers ra ON ra.question_id = q.id
     WHERE ra.response_id = $1
     ORDER BY s.sort_order, q.sort_order`,
    [id]
  );

  const map = new Map<
    string,
    {
      slug: string;
      name: string;
      planet: string;
      virtue: string;
      vice: string | null;
      color: string;
      summary: string;
      problemCount: number;
      checked: { id: number; prompt: string }[];
    }
  >();

  for (const row of rows.rows) {
    if (!map.has(row.slug)) {
      map.set(row.slug, {
        slug: row.slug,
        name: row.name,
        planet: row.planet,
        virtue: row.virtue,
        vice: row.vice,
        color: row.color,
        summary: row.summary,
        problemCount: 0,
        checked: []
      });
    }
    if (row.checked) {
      const entry = map.get(row.slug)!;
      entry.problemCount += 1;
      entry.checked.push({ id: row.question_id, prompt: row.prompt });
    }
  }

  return {
    id: response.rows[0].id,
    participantName: response.rows[0].participant_name,
    createdAt: response.rows[0].created_at,
    sefirot: [...map.values()]
  };
}

async function start() {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await initDb(SEFIROT);
      break;
    } catch (error) {
      if (attempt === 20) throw error;
      console.log(`Aștept Postgres (${attempt}/20)...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  app.listen(port, () => {
    console.log(`Kabbalah API listening on ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
