import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import FadeContent from "./components/react-bits/FadeContent";
import LightRays from "./components/react-bits/LightRays";
import SplitText from "./components/react-bits/SplitText";
import SpotlightCard from "./components/react-bits/SpotlightCard";
import TreeOfLife from "./components/TreeOfLife";
import { getQuestionnaire, localQuestionnaire, submitResponse, type Questionnaire, type ResultPayload } from "./lib/api";

type Stage = "intro" | "form" | "result";

export default function App() {
  const [data, setData] = useState<Questionnaire>(() => localQuestionnaire());
  const [error, setError] = useState("");
  const [stage, setStage] = useState<Stage>("intro");
  const [name, setName] = useState("");
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
      const payload = await submitResponse(data, name, answers);
      setResult(payload);
      setStage("result");
    } catch {
      setError("Nu am putut salva răspunsurile.");
    } finally {
      setSaving(false);
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
                <div className="row">
                  <input
                    className="name-input"
                    placeholder="Nume (opțional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button className="gold-btn" type="button" onClick={() => setStage("form")}>
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
            <p className="lede">
              Cifra din fiecare sefiră este numărul de probleme bifate. Deschide o sefiră (hover pe desktop, tap pe
              mobil), apoi apasă o problemă pentru soluția ei.
            </p>
            <TreeOfLife result={result} />

            <p className="disclaimer">
              Sfaturile de aici sunt orientative și nu reprezintă o consiliere calificată, adaptabilă oricărei situații.
            </p>
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
