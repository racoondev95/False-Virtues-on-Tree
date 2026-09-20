import { INTRO, SEFIROT } from "../data/catalog";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export type Question = {
  id: number;
  sefira_id: number;
  prompt: string;
  sort_order: number;
};

export type Sefira = {
  id: number;
  slug: string;
  name: string;
  planet: string;
  virtue: string;
  vice: string | null;
  color: string;
  summary: string;
  sort_order: number;
  questions: Question[];
};

export type Questionnaire = {
  intro: { title: string; subtitle: string; body: string };
  sefirot: Sefira[];
};

export type ResultPayload = {
  id: string;
  participantName: string | null;
  createdAt: string;
  saved: boolean;
  sefirot: {
    slug: string;
    name: string;
    planet: string;
    virtue: string;
    vice: string | null;
    color: string;
    summary: string;
    problemCount: number;
    checked: { id: number; prompt: string }[];
  }[];
};

export function localQuestionnaire(): Questionnaire {
  return {
    intro: INTRO,
    sefirot: SEFIROT.map((sefira, index) => ({
      id: index + 1,
      slug: sefira.slug,
      name: sefira.name,
      planet: sefira.planet,
      virtue: sefira.virtue,
      vice: sefira.vice,
      color: sefira.color,
      summary: sefira.summary,
      sort_order: index,
      questions: sefira.questions.map((prompt, qIndex) => ({
        id: (index + 1) * 100 + qIndex,
        sefira_id: index + 1,
        prompt,
        sort_order: qIndex
      }))
    }))
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    signal: AbortSignal.timeout(2500),
    ...init
  });
  if (!res.ok) {
    throw new Error("Cererea către API a eșuat.");
  }
  return res.json() as Promise<T>;
}

export async function getQuestionnaire() {
  try {
    return await request<Questionnaire>("/questionnaire");
  } catch {
    return localQuestionnaire();
  }
}

export function buildLocalResult(
  questionnaire: Questionnaire,
  participantName: string,
  answers: { questionId: number; checked: boolean }[],
  saved: boolean
): ResultPayload {
  const checkedIds = new Set(answers.filter((a) => a.checked).map((a) => a.questionId));
  return {
    id: saved ? "" : "local",
    participantName: participantName || null,
    createdAt: new Date().toISOString(),
    saved,
    sefirot: questionnaire.sefirot.map((s) => {
      const checked = s.questions.filter((q) => checkedIds.has(q.id)).map((q) => ({ id: q.id, prompt: q.prompt }));
      return {
        slug: s.slug,
        name: s.name,
        planet: s.planet,
        virtue: s.virtue,
        vice: s.vice,
        color: s.color,
        summary: s.summary,
        problemCount: checked.length,
        checked
      };
    })
  };
}

export async function submitResponse(
  questionnaire: Questionnaire,
  participantName: string,
  answers: { questionId: number; checked: boolean }[]
) {
  try {
    const payload = await request<Omit<ResultPayload, "saved">>("/responses", {
      method: "POST",
      body: JSON.stringify({ participantName, answers })
    });
    return { ...payload, saved: true };
  } catch {
    return buildLocalResult(questionnaire, participantName, answers, false);
  }
}
