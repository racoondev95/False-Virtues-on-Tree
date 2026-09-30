import { useEffect, useMemo, useState } from "react";
import LightRays from "./components/react-bits/LightRays";
import { solutionFor } from "./data/solutions";
import {
  adminExport,
  adminList,
  adminLogin,
  adminResult,
  type AdminListItem,
  type ResultPayload
} from "./lib/api";
import { downloadAllResultsPdf, downloadContactsPdf, downloadResultPdf } from "./lib/pdf";

const SESSION_KEY = "kabbalah-admin-password";

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ro-RO", { dateStyle: "medium", timeStyle: "short" });
}

function show(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : "—";
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [people, setPeople] = useState<AdminListItem[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfJob, setPdfJob] = useState<"contacts" | "full" | "one" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ResultPayload | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const previous = document.title;
    document.title = "Arhivă chestionar";
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) void enter(saved);
    return () => {
      document.title = previous;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return people;
    return people.filter((person) =>
      [person.lastName, person.firstName, person.email, person.phone, person.participantName]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [people, query]);

  async function enter(nextPassword: string) {
    setLoading(true);
    setError("");
    try {
      await adminLogin(nextPassword);
      const rows = await adminList(nextPassword);
      sessionStorage.setItem(SESSION_KEY, nextPassword);
      setPassword(nextPassword);
      setPeople(rows);
      setAuthorized(true);
    } catch (err) {
      sessionStorage.removeItem(SESSION_KEY);
      setAuthorized(false);
      setError(err instanceof Error ? err.message : "Parolă incorectă.");
    } finally {
      setLoading(false);
    }
  }

  async function openPerson(id: string) {
    if (selectedId === id) {
      setSelectedId(null);
      setDetail(null);
      return;
    }
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    setError("");
    try {
      setDetail(await adminResult(password, id));
    } catch (err) {
      setSelectedId(null);
      setError(err instanceof Error ? err.message : "Nu am putut încărca datele.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function saveContacts() {
    setPdfJob("contacts");
    setError("");
    try {
      await downloadContactsPdf(people);
    } catch {
      setError("Nu am putut genera PDF-ul de contacte.");
    } finally {
      setPdfJob(null);
    }
  }

  async function saveAll() {
    setPdfJob("full");
    setError("");
    try {
      const results = await adminExport(password);
      await downloadAllResultsPdf(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu am putut genera PDF-ul complet.");
    } finally {
      setPdfJob(null);
    }
  }

  async function saveOne() {
    if (!detail) return;
    setPdfJob("one");
    setError("");
    try {
      await downloadResultPdf(detail);
    } catch {
      setError("Nu am putut genera PDF-ul acestei persoane.");
    } finally {
      setPdfJob(null);
    }
  }

  function leave() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthorized(false);
    setPassword("");
    setPeople([]);
    setQuery("");
    setSelectedId(null);
    setDetail(null);
  }

  return (
    <div className="app-shell">
      <div className="bg-layer">
        <LightRays raysColor="#d4b45a" className="h-full w-full" />
      </div>
      <div className="content-layer content-wide">
        <div className="result-card">
          <div className="kicker">Arhivă</div>
          <h1 className="serif title" style={{ fontSize: "clamp(36px, 5vw, 56px)" }}>
            Răspunsurile chestionarului
          </h1>

          {!authorized ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void enter(password);
              }}
            >
              <p className="lede">Pagina nu cere un cont. Intrarea se face cu parola arhivei.</p>
              <div className="row">
                <input
                  className="name-input"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Parolă"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button className="gold-btn" type="submit" disabled={loading || !password}>
                  {loading ? "Se verifică..." : "Intră"}
                </button>
              </div>
              {error && <p className="error">{error}</p>}
            </form>
          ) : (
            <>
              <p className="lede">
                {people.length} {people.length === 1 ? "răspuns salvat" : "răspunsuri salvate"}. Caută în tabel sau
                descarcă un PDF cu toată arhiva.
              </p>
              <div className="admin-actions">
                <button className="gold-btn" type="button" disabled={pdfJob !== null} onClick={() => void saveAll()}>
                  {pdfJob === "full" ? "Se generează PDF-ul..." : "Descarcă PDF cu toate datele"}
                </button>
                <button className="ghost-btn" type="button" disabled={pdfJob !== null} onClick={() => void saveContacts()}>
                  {pdfJob === "contacts" ? "Se generează PDF-ul..." : "Descarcă PDF cu Nume, Prenume, Email, Telefon"}
                </button>
                <button className="ghost-btn" type="button" onClick={leave}>
                  Ieși
                </button>
              </div>
              <input
                className="name-input admin-search"
                placeholder="Caută după nume, prenume, email sau telefon"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {error && <p className="error">{error}</p>}
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nume</th>
                      <th>Prenume</th>
                      <th>Email</th>
                      <th>Telefon</th>
                      <th>Data</th>
                      <th>Bifate</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7}>{people.length === 0 ? "Niciun răspuns salvat." : "Nicio potrivire."}</td>
                      </tr>
                    ) : (
                      filtered.map((person) => (
                        <tr key={person.id} className={selectedId === person.id ? "active" : ""}>
                          <td>{show(person.lastName || person.participantName)}</td>
                          <td>{show(person.firstName)}</td>
                          <td>{show(person.email)}</td>
                          <td>{show(person.phone)}</td>
                          <td>{formatWhen(person.createdAt)}</td>
                          <td>{person.problemCount}</td>
                          <td>
                            <button className="ghost-btn table-btn" type="button" onClick={() => void openPerson(person.id)}>
                              {selectedId === person.id ? "Închide" : "Vezi"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {detailLoading && <p className="lede">Se încarcă răspunsul...</p>}
              {detail && (
                <div className="admin-detail">
                  <div className="row" style={{ marginTop: 0 }}>
                    <h2 className="serif" style={{ margin: 0, fontSize: 32 }}>
                      {show(detail.lastName || detail.participantName)} {show(detail.firstName)}
                    </h2>
                    <button className="gold-btn" type="button" disabled={pdfJob !== null} onClick={() => void saveOne()}>
                      {pdfJob === "one" ? "Se generează PDF-ul..." : "PDF pentru această persoană"}
                    </button>
                  </div>
                  <p className="identity-line">
                    {show(detail.email)} · {show(detail.phone)} · {formatWhen(detail.createdAt)}
                  </p>
                  {detail.sefirot.map((sefira) => (
                    <section key={sefira.slug} className="admin-sefira">
                      <h3 className="serif">
                        {sefira.name} · {sefira.problemCount}
                      </h3>
                      <p>{sefira.summary}</p>
                      {sefira.checked.length === 0 ? (
                        <p className="muted-copy">Nicio afirmație bifată.</p>
                      ) : (
                        sefira.checked.map((item) => (
                          <div key={item.id} className="admin-answer">
                            <strong>{item.prompt}</strong>
                            <p>{solutionFor(item.prompt)}</p>
                          </div>
                        ))
                      )}
                    </section>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
