import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import FadeContent from "./components/react-bits/FadeContent";
import LightRays from "./components/react-bits/LightRays";
import SplitText from "./components/react-bits/SplitText";
import SpotlightCard from "./components/react-bits/SpotlightCard";
import TreeOfLife from "./components/TreeOfLife";
import { getQuestionnaire, localQuestionnaire, submitResponse, type ParticipantInput, type Questionnaire, type ResultPayload } from "./lib/api";
import { downloadResultPdf } from "./lib/pdf";

type Stage = "intro" | "form" | "result";

export default function App() {
  const [data, setData] = useState<Questionnaire>(() => localQuestionnaire());
  const [error, setError] = useState("");
  const [stage, setStage] = useState<Stage>("intro");
  const [identity, setIdentity] = useState<ParticipantInput>({ lastName: "", firstName: "", email: "", phone: "" });
  const [pdfBusy, setPdfBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [saving, setSaving] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<Stage>("intro");
  stageRef.current = stage;

  useEffect(() => {
    getQuestionnaire().then((remote) => {
      if (stageRef.current === "intro") setData(remote);
    });
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" });
    }, el);
    return () => ctx.revert();
  }, [stage, step]);

  const current = data?.sefirot[step];
  const answers = useMemo(() => {
    if (!data) return [];
    return data.sefirot.flatMap((s) => s.questions.map((q) => ({ questionId: q.id, checked: Boolean(checked[q.id]) })));
  }, [data, checked]);

  async function finish() {
    setSaving(true);
    setError("");
    try {
      const payload = await submitResponse(data, identity, answers);
      setResult(payload);
      setStage("result");
    } catch {
      setError("Nu am putut salva răspunsurile.");
    } finally {
      setSaving(false);
    }
  }

  function identityError() {
    const lastName = identity.lastName.trim();
    const firstName = identity.firstName.trim();
    const email = identity.email.trim();
    const phone = identity.phone.trim();
    if (!lastName || !firstName || !email || !phone) {
      return "Completează numele, prenumele, emailul și telefonul.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Emailul nu pare valid.";
    if (phone.replace(/\D/g, "").length < 6) return "Telefonul nu pare valid.";
    return "";
  }

  function begin() {
    const message = identityError();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStage("form");
  }

  function updateIdentity(field: keyof ParticipantInput, value: string) {
    setIdentity((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  }

  async function savePdf() {
    if (!result) return;
    setPdfBusy(true);
    setError("");
    try {
      await downloadResultPdf(result);
    } catch {
      setError("Nu am putut genera PDF-ul.");
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="bg-layer">
        <LightRays raysColor="#d4b45a" className="h-full w-full" />
      </div>
      <div className="content-layer">
        {error && <p className="error">{error}</p>}

        {data && stage === "intro" && (
          <div ref={sceneRef}>
            <SpotlightCard>
              <div className="kicker">{data.intro.subtitle}</div>
              <SplitText text={data.intro.title} className="title serif" />
              <FadeContent delay={0.2}>
                <p className="lede">{data.intro.body}</p>
                <div className="identity-grid">
                  <input
                    className="name-input"
                    placeholder="Nume"
                    autoComplete="family-name"
                    value={identity.lastName}
                    onChange={(e) => updateIdentity("lastName", e.target.value)}
                  />
                  <input
                    className="name-input"
                    placeholder="Prenume"
                    autoComplete="given-name"
                    value={identity.firstName}
                    onChange={(e) => updateIdentity("firstName", e.target.value)}
                  />
                  <input
                    className="name-input"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={identity.email}
                    onChange={(e) => updateIdentity("email", e.target.value)}
                  />
                  <input
                    className="name-input"
                    type="tel"
                    placeholder="Telefon"
                    autoComplete="tel"
                    value={identity.phone}
                    onChange={(e) => updateIdentity("phone", e.target.value)}
                  />
                </div>
                <p className="identity-note">Aceste date apar pe PDF-ul rezultatului și se salvează împreună cu răspunsurile.</p>
                <div className="row">
                  <button className="gold-btn" type="button" onClick={begin}>
                    Începe chestionarul
                  </button>
                </div>
              </FadeContent>
            </SpotlightCard>
          </div>
        )}

        {data && current && stage === "form" && (
          <div ref={sceneRef} className="form-card">
            <div className="progress">
              {data.sefirot.map((s, index) => (
                <span key={s.slug} className={index === step ? "active" : index < step ? "done" : ""} />
              ))}
            </div>
            <div className="sefira-meta">
              <div>
                <div className="kicker">
                  {current.planet} · {step + 1}/{data.sefirot.length}
                </div>
                <h2 className="serif" style={{ margin: 0, fontSize: 42 }}>
                  {current.name}
                </h2>
                <p style={{ color: "#e8c547", margin: "6px 0 0" }}>
                  Virtute: {current.virtue}
                  {current.vice ? ` · Viciu: ${current.vice}` : ""}
                </p>
              </div>
            </div>
            <p className="lede">{current.summary}</p>
            <p style={{ marginTop: 18, marginBottom: 8 }}>Bifează ce ți se aplică:</p>
            <div className="questions">
              {current.questions.map((q) => (
                <label key={q.id} className={`question ${checked[q.id] ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[q.id])}
                    onChange={(e) => setChecked((prev) => ({ ...prev, [q.id]: e.target.checked }))}
                  />
                  <span>{q.prompt}</span>
                </label>
              ))}
            </div>
            <div className="row">
              <button className="ghost-btn" type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                Înapoi
              </button>
              {step < data.sefirot.length - 1 ? (
                <button className="gold-btn" type="button" onClick={() => setStep((s) => s + 1)}>
                  Continuă
                </button>
              ) : (
                <button className="gold-btn" type="button" disabled={saving} onClick={finish}>
                  {saving ? "Se salvează..." : "Vezi Arborele"}
                </button>
              )}
            </div>
          </div>
        )}

        {result && stage === "result" && (
          <div ref={sceneRef} className="result-card">
            <div className="kicker">{result.saved ? "Rezultat salvat în baza de date" : "Rezultat local (API/DB indisponibil)"}</div>
            <h2 className="serif" style={{ fontSize: 44, marginTop: 0 }}>
              Arborele Vieții
            </h2>
            <p className="identity-line">
              {result.lastName} {result.firstName} · {result.email} · {result.phone}
            </p>
            <p className="lede">
              Cifra din fiecare sefiră arată câte afirmații ai recunoscut. Deschide o sefiră (hover pe desktop, tap pe
              mobil), apoi apasă o problemă pentru soluția ei.
            </p>
            <TreeOfLife result={result} />

            <p className="disclaimer">
              Sfaturile de aici sunt orientative și nu reprezintă o consiliere calificată, adaptabilă oricărei situații.
            </p>
            <div className="pdf-row">
              <button className="gold-btn" type="button" disabled={pdfBusy} onClick={() => void savePdf()}>
                {pdfBusy ? "Se generează PDF-ul..." : "Salvează rezultatul ca PDF"}
              </button>
            </div>
            <div className="cta-row">
              <a className="gold-btn cta-link" href="https://institutulhermetic.ro" target="_blank" rel="noreferrer">
                Vino pe Institutul Hermetic pentru o experiență mistică autentică
              </a>
              <a className="ghost-btn cta-link" href="https://elohim.work" target="_blank" rel="noreferrer">
                Vino pe Comunitate SETV
              </a>
            </div>

            <div className="row">
              <button
                className="ghost-btn"
                type="button"
                onClick={() => {
                  setChecked({});
                  setStep(0);
                  setResult(null);
                  setStage("intro");
                }}
              >
                Chestionar nou
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
