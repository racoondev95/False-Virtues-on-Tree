import { createHash, timingSafeEqual } from "node:crypto";
import cors from "cors";
import express from "express";
import { INTRO, SEFIROT } from "./catalog.js";
import { initDb, pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const ADMIN_PASSWORD = "Supr3Mus";

app.use(
  cors({
    origin: corsOrigin.split(",").map((s) => s.trim()),
    allowedHeaders: ["Content-Type", "x-admin-password"]
  })
);
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
  const lastName = cleanText(req.body?.lastName);
  const firstName = cleanText(req.body?.firstName);
  const email = cleanText(req.body?.email);
  const phone = cleanText(req.body?.phone);
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];

  if (!lastName || !firstName || !email || !phone) {
    res.status(400).json({ error: "Completează numele, prenumele, emailul și telefonul." });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Emailul nu pare valid." });
    return;
  }
  if (phone.replace(/\D/g, "").length < 6) {
    res.status(400).json({ error: "Telefonul nu pare valid." });
    return;
  }

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
      `INSERT INTO responses (participant_name, last_name, first_name, email, phone)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [`${lastName} ${firstName}`, lastName, firstName, email, phone]
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
  const result = await loadResult(routeId(req.params.id));
  if (!result) {
    res.status(404).json({ error: "Răspunsul nu a fost găsit." });
    return;
  }
  res.json(result);
});

app.post("/api/admin/login", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!passwordMatches(password)) {
    res.status(401).json({ error: "Parolă incorectă." });
    return;
  }
  res.json({ ok: true });
});

app.get("/api/admin/responses", requireAdmin, async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    const rows = await pool.query(
      `SELECT
         r.id,
         r.participant_name,
         r.last_name,
         r.first_name,
         r.email,
         r.phone,
         r.created_at,
         COUNT(*) FILTER (WHERE ra.checked) AS problem_count
       FROM responses r
       LEFT JOIN response_answers ra ON ra.response_id = r.id
       WHERE (
         $1 = '' OR
         COALESCE(r.last_name, '') ILIKE $2 ESCAPE '\\' OR
         COALESCE(r.first_name, '') ILIKE $2 ESCAPE '\\' OR
         COALESCE(r.email, '') ILIKE $2 ESCAPE '\\' OR
         COALESCE(r.phone, '') ILIKE $2 ESCAPE '\\' OR
         COALESCE(r.participant_name, '') ILIKE $2 ESCAPE '\\'
       )
       GROUP BY r.id
       ORDER BY r.created_at DESC`,
      [q, like]
    );
    res.json(rows.rows.map(toListItem));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nu am putut citi răspunsurile." });
  }
});

app.get("/api/admin/responses/:id", requireAdmin, async (req, res) => {
  try {
    const result = await loadResult(routeId(req.params.id));
    if (!result) {
      res.status(404).json({ error: "Răspunsul nu a fost găsit." });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nu am putut citi răspunsul." });
  }
});

app.get("/api/admin/export", requireAdmin, async (_req, res) => {
  try {
    res.json(await loadAllResults());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nu am putut citi răspunsurile." });
  }
});

function routeId(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function passwordMatches(given: string) {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(ADMIN_PASSWORD).digest();
  return timingSafeEqual(a, b);
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const password = req.header("x-admin-password") ?? "";
  if (!passwordMatches(password)) {
    res.status(401).json({ error: "Parolă incorectă." });
    return;
  }
  next();
}

type AnswerRow = {
  slug: string | null;
  name: string;
  planet: string;
  virtue: string;
  vice: string | null;
  color: string;
  summary: string;
  question_id: number;
  prompt: string;
  checked: boolean;
};

type ResponseMeta = {
  id: string;
  participant_name: string | null;
  last_name: string | null;
  first_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: Date | string;
};

function toListItem(row: ResponseMeta & { problem_count: string | number }) {
  return {
    id: row.id,
    participantName: row.participant_name,
    lastName: row.last_name,
    firstName: row.first_name,
    email: row.email,
    phone: row.phone,
    createdAt: new Date(row.created_at).toISOString(),
    problemCount: Number(row.problem_count ?? 0)
  };
}

function toPayload(meta: ResponseMeta, rows: AnswerRow[]) {
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
      questions: { id: number; prompt: string; checked: boolean }[];
      checked: { id: number; prompt: string }[];
    }
  >();

  for (const row of rows) {
    if (!row.slug) continue;
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
        questions: [],
        checked: []
      });
    }
    const entry = map.get(row.slug)!;
    const question = { id: row.question_id, prompt: row.prompt, checked: Boolean(row.checked) };
    entry.questions.push(question);
    if (question.checked) {
      entry.problemCount += 1;
      entry.checked.push({ id: question.id, prompt: question.prompt });
    }
  }

  return {
    id: meta.id,
    participantName: meta.participant_name,
    lastName: meta.last_name,
    firstName: meta.first_name,
    email: meta.email,
    phone: meta.phone,
    createdAt: new Date(meta.created_at).toISOString(),
    sefirot: [...map.values()]
  };
}

async function loadResult(id: string) {
  const response = await pool.query(
    `SELECT id, participant_name, last_name, first_name, email, phone, created_at
     FROM responses WHERE id = $1`,
    [id]
  );
  if (!response.rowCount) return null;

  const rows = await pool.query(
    `SELECT
       s.slug, s.name, s.planet, s.virtue, s.vice, s.color, s.summary,
       q.id AS question_id, q.prompt, ra.checked
     FROM sefirot s
     JOIN questions q ON q.sefira_id = s.id
     JOIN response_answers ra ON ra.question_id = q.id
     WHERE ra.response_id = $1
     ORDER BY s.sort_order, q.sort_order`,
    [id]
  );

  return toPayload(response.rows[0] as ResponseMeta, rows.rows as AnswerRow[]);
}

async function loadAllResults() {
  const rows = await pool.query(
    `SELECT
       r.id AS response_id,
       r.participant_name, r.last_name, r.first_name, r.email, r.phone, r.created_at,
       s.slug, s.name, s.planet, s.virtue, s.vice, s.color, s.summary,
       q.id AS question_id, q.prompt, ra.checked
     FROM responses r
     LEFT JOIN response_answers ra ON ra.response_id = r.id
     LEFT JOIN questions q ON q.id = ra.question_id
     LEFT JOIN sefirot s ON s.id = q.sefira_id
     ORDER BY r.created_at DESC, r.id, s.sort_order, q.sort_order`
  );

  const order: string[] = [];
  const buckets = new Map<string, { meta: ResponseMeta; answers: AnswerRow[] }>();
  for (const row of rows.rows) {
    const id = row.response_id as string;
    if (!buckets.has(id)) {
      order.push(id);
      buckets.set(id, {
        meta: {
          id,
          participant_name: row.participant_name,
          last_name: row.last_name,
          first_name: row.first_name,
          email: row.email,
          phone: row.phone,
          created_at: row.created_at
        },
        answers: []
      });
    }
    if (row.slug) buckets.get(id)!.answers.push(row as AnswerRow);
  }

  return order.map((id) => {
    const bucket = buckets.get(id)!;
    return toPayload(bucket.meta, bucket.answers);
  });
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
