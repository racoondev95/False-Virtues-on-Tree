import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { solutionFor } from "../data/solutions";
import type { ResultPayload } from "../lib/api";

const NODES: { slug: string; x: number; y: number }[] = [
  { slug: "kether", x: 200, y: 48 },
  { slug: "chokmah", x: 318, y: 118 },
  { slug: "binah", x: 82, y: 118 },
  { slug: "hessed", x: 318, y: 248 },
  { slug: "ghebura", x: 82, y: 248 },
  { slug: "tiferet", x: 200, y: 318 },
  { slug: "netah", x: 318, y: 448 },
  { slug: "hod", x: 82, y: 448 },
  { slug: "yesod", x: 200, y: 528 },
  { slug: "malkut", x: 200, y: 648 }
];

function textFill(hex: string) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.6 ? "#1b1406" : "#f8f1d8";
}

const PATHS: [string, string][] = [
  ["kether", "chokmah"],
  ["kether", "binah"],
  ["kether", "tiferet"],
  ["chokmah", "binah"],
  ["chokmah", "hessed"],
  ["chokmah", "tiferet"],
  ["binah", "ghebura"],
  ["binah", "tiferet"],
  ["hessed", "ghebura"],
  ["hessed", "tiferet"],
  ["hessed", "netah"],
  ["ghebura", "tiferet"],
  ["ghebura", "hod"],
  ["tiferet", "netah"],
  ["tiferet", "hod"],
  ["tiferet", "yesod"],
  ["netah", "hod"],
  ["netah", "yesod"],
  ["hod", "yesod"],
  ["yesod", "malkut"]
];

type Props = {
  result: ResultPayload;
};

export default function TreeOfLife({ result }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [solutionId, setSolutionId] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const bySlug = useMemo(() => new Map(result.sefirot.map((s) => [s.slug, s])), [result.sefirot]);
  const nodeMap = useMemo(() => new Map(NODES.map((n) => [n.slug, n])), []);
  const selected = active ? bySlug.get(active) : null;
  const activeProblem = selected?.checked.find((item) => item.id === solutionId) ?? null;
  const locked = pinned || isTouch;

  useEffect(() => {
    const query = window.matchMedia("(hover: none), (pointer: coarse), (max-width: 900px)");
    const update = () => setIsTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (solutionId !== null) setSolutionId(null);
      else closePopup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, solutionId]);

  function clearTimer() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openSefira(slug: string, pin: boolean) {
    clearTimer();
    setActive(slug);
    setPinned(pin);
    setSolutionId(null);
  }

  function closePopup() {
    clearTimer();
    setActive(null);
    setPinned(false);
    setSolutionId(null);
  }

  function scheduleClose() {
    if (locked) return;
    clearTimer();
    closeTimer.current = window.setTimeout(closePopup, 420);
  }

  function toggleSolution(id: number) {
    setSolutionId((prev) => (prev === id ? null : id));
  }

  const panels = selected && (
    <>
      <div className="popup-panel">
        <button className="popup-close" type="button" onClick={closePopup} aria-label="Închide">
          ×
        </button>
        <h3 className="serif">{selected.name}</h3>
        <div className="sub">
          {selected.planet} · {selected.virtue}
          {selected.vice ? ` · viciu: ${selected.vice}` : ""}
        </div>
        <p>{selected.summary}</p>
        <p>
          Afirmații bifate: <strong style={{ color: "#e8c547" }}>{selected.problemCount}</strong>
          {selected.checked.length > 0 ? " · apasă una pentru o invitație de soluție" : ""}
        </p>
        {selected.checked.length > 0 ? (
          <div className="popup-list">
            {selected.checked.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`problem-row ${solutionId === item.id ? "active" : ""}`}
                onClick={() => toggleSolution(item.id)}
                aria-expanded={solutionId === item.id}
              >
                <span>{item.prompt}</span>
                <span className="problem-chevron">{solutionId === item.id ? "−" : "+"}</span>
              </button>
            ))}
          </div>
        ) : (
          <p>Nicio afirmație bifată la această sefiră — e în regulă.</p>
        )}
      </div>

      {activeProblem && (
        <div className="popup-panel solution-panel">
          <button className="popup-close" type="button" onClick={() => setSolutionId(null)} aria-label="Închide soluția">
            ×
          </button>
          <div className="kicker">Invitație</div>
          <h3 className="serif">Virtutea reală</h3>
          <p className="problem-echo">{activeProblem.prompt}</p>
          <p>{solutionFor(activeProblem.prompt)}</p>
        </div>
      )}
    </>
  );

  return (
    <div className="tree-wrap">
      <div className="tree-stage">
        <svg className="tree-svg" viewBox="0 0 400 700" role="img" aria-label="Arborele Vieții">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e8c547" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e8c547" stopOpacity="0" />
            </radialGradient>
          </defs>
          {PATHS.map(([a, b]) => {
            const from = nodeMap.get(a)!;
            const to = nodeMap.get(b)!;
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(232,197,71,0.42)"
                strokeWidth="2.2"
              />
            );
          })}
          {NODES.map((node) => {
            const data = bySlug.get(node.slug);
            if (!data) return null;
            const count = data.problemCount;
            const intensity = Math.min(1, count / 6);
            return (
              <g
                key={node.slug}
                className="sefira-hit"
                onMouseEnter={() => !isTouch && !(pinned && active === node.slug) && openSefira(node.slug, false)}
                onMouseLeave={scheduleClose}
                onClick={() => (active === node.slug && locked ? closePopup() : openSefira(node.slug, true))}
                onFocus={() => openSefira(node.slug, true)}
                tabIndex={0}
                role="button"
                aria-label={`${data.name}: ${count} afirmații bifate`}
              >
                <circle cx={node.x} cy={node.y} r="46" fill="transparent" />
                <circle cx={node.x} cy={node.y} r="42" fill="url(#glow)" />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="28"
                  fill={data.color}
                  stroke={active === node.slug ? "#fff6d4" : "rgba(255,255,255,0.55)"}
                  strokeWidth={active === node.slug ? 3 : 1.4}
                  opacity={0.55 + intensity * 0.45}
                />
                <text x={node.x} y={node.y + 8} textAnchor="middle" className="count-badge" fill={textFill(data.color)}>
                  {count}
                </text>
              </g>
            );
          })}
        </svg>

      </div>

      {selected &&
        createPortal(
          <>
            {locked && <div className="popup-backdrop" onClick={closePopup} />}
            <div className="popup-layer">
              <div
                className="popup-cluster"
                role="dialog"
                aria-label={selected.name}
                onMouseEnter={clearTimer}
                onMouseLeave={scheduleClose}
              >
                {panels}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
