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

export type ParticipantInput = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
};

export type ResultQuestion = {
  id: number;
  prompt: string;
  checked: boolean;
};

export type ResultPayload = {
  id: string;
  participantName: string | null;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  phone: string | null;
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
    questions: ResultQuestion[];
    checked: { id: number; prompt: string }[];
  }[];
};

export type AdminListItem = {
  id: string;
  participantName: string | null;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  problemCount: number;
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

async function request<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const { timeoutMs = 2500, headers, ...rest } = init ?? {};
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: { "Content-Type": "application/json", ...headers },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res.ok) {
      let message = "Cererea către API a eșuat.";
      try {
        const body = (await res.json()) as { error?: string };
        if (body?.error) message = body.error;
      } catch {
        /* răspuns fără JSON */
      }
      throw new Error(message);
    }
    return (await res.json()) as T;
  } catch (error) {
    if (
      error instanceof TypeError ||
      (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError"))
    ) {
      throw new Error("Nu am putut contacta serverul.");
    }
    throw error;
  }
}

function adminInit(password: string, timeoutMs: number, init?: RequestInit): RequestInit & { timeoutMs: number } {
  return {
    ...init,
    timeoutMs,
    headers: { "x-admin-password": password, ...(init?.headers || {}) }
  };
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
  participant: ParticipantInput,
  answers: { questionId: number; checked: boolean }[],
  saved: boolean
): ResultPayload {
  const checkedIds = new Set(answers.filter((a) => a.checked).map((a) => a.questionId));
  const lastName = participant.lastName.trim();
  const firstName = participant.firstName.trim();
  return {
    id: saved ? "" : "local",
    participantName: `${lastName} ${firstName}`.trim() || null,
    lastName: lastName || null,
    firstName: firstName || null,
    email: participant.email.trim() || null,
    phone: participant.phone.trim() || null,
    createdAt: new Date().toISOString(),
    saved,
    sefirot: questionnaire.sefirot.map((s) => {
      const questions = s.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        checked: checkedIds.has(q.id)
      }));
      return {
        slug: s.slug,
        name: s.name,
        planet: s.planet,
        virtue: s.virtue,
        vice: s.vice,
        color: s.color,
        summary: s.summary,
        problemCount: questions.filter((q) => q.checked).length,
        questions,
        checked: questions.filter((q) => q.checked).map((q) => ({ id: q.id, prompt: q.prompt }))
      };
    })
  };
}

export async function submitResponse(
  questionnaire: Questionnaire,
  participant: ParticipantInput,
  answers: { questionId: number; checked: boolean }[]
) {
  try {
    const payload = await request<Omit<ResultPayload, "saved">>("/responses", {
      method: "POST",
      body: JSON.stringify({ ...participant, answers })
    });
    return { ...payload, saved: true };
  } catch {
    return buildLocalResult(questionnaire, participant, answers, false);
  }
}

export async function adminLogin(password: string) {
  await request<{ ok: true }>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
    timeoutMs: 8000
  });
}

export async function adminList(password: string) {
  return request<AdminListItem[]>("/admin/responses", adminInit(password, 20000));
}

export async function adminResult(password: string, id: string) {
  const payload = await request<Omit<ResultPayload, "saved">>(`/admin/responses/${id}`, adminInit(password, 20000));
  return { ...payload, saved: true };
}

export async function adminExport(password: string) {
  const payload = await request<Omit<ResultPayload, "saved">[]>("/admin/export", adminInit(password, 120000));
  return payload.map((item) => ({ ...item, saved: true }));
}
