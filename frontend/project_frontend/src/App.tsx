import { useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"

type Allied = { is_number: string; title: string; type: string; reason?: string | null }
type Certification = { name: string; mandatory: boolean; details?: string | null; qco_order?: string | null; source_url?: string | null }
type Standard = {
  is_number: string
  title: string
  category: string
  relevance_score: number
  reason: string
  status: string
  current_version?: string | null
  revision?: string | null
  amendments: string[]
  reviewed_year?: number | null
  reaffirmation_year?: number | null
  certification: Certification[]
  allied_standards: Allied[]
  source_url?: string | null
  verified_on?: string | null
}
type Response = {
  query: string
  input_type: string
  recommendations: Standard[]
  compliance_summary: string
  tender_clause: string
}

const domains = ["All", "Electrical", "Plumbing", "Lighting"]

async function analyse(specification: string, domain: string, file?: File): Promise<Response> {
  const body = new FormData()
  if (specification.trim()) body.append("specification", specification)
  if (domain !== "All") body.append("domain", domain)
  if (file) body.append("file", file)

  const response = await fetch(`${API_BASE}/recommend/analyze`, { method: "POST", body })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.detail ?? `Request failed (${response.status})`)
  }
  return response.json()
}

function App() {
  const [specification, setSpecification] = useState("")
  const [domain, setDomain] = useState("All")
  const [file, setFile] = useState<File | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<Response | null>(null)

  const run = async () => {
    if (!specification.trim() && !file) {
      setError("Enter a product description/tender specification or upload a document.")
      return
    }
    setLoading(true)
    setError("")
    try {
      setResult(await analyse(specification, domain, file))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  const top = result?.recommendations[0]
  const copy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <div className="eyebrow">BIS • PROCUREMENT INTELLIGENCE</div>
          <h1>Indian Standards Recommendation Engine</h1>
          <p>Semantic standards discovery • allied references • version/amendment tracking • certification gates</p>
        </div>
        <div className="badge">3 DEMO CATEGORIES</div>
      </header>

      <section className="workspace">
        <aside className="input-panel">
          <label>Product / Tender Input</label>
          <textarea
            value={specification}
            onChange={e => setSpecification(e.target.value)}
            placeholder="Example: Procurement of 1100V PVC insulated copper cables for building wiring..."
          />

          <label>Category Filter</label>
          <select value={domain} onChange={e => setDomain(e.target.value)}>
            {domains.map(d => <option key={d}>{d}</option>)}
          </select>

          <label>Upload Tender / Specification</label>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,.csv"
            onChange={e => setFile(e.target.files?.[0])}
          />
          {file && <div className="file">Selected: {file.name}</div>}

          <button onClick={run} disabled={loading} className="primary">
            {loading ? "Analysing…" : "Analyse Specification"}
          </button>
          {error && <div className="error">{error}</div>}

          <div className="architecture">
            <b>Pipeline</b>
            <span>Input → extraction → embeddings → semantic retrieval → dependency graph → certification gate → clause</span>
          </div>
        </aside>

        <section className="results">
          {!result && <div className="empty">Submit a specification to see ranked Indian Standards and compliance intelligence.</div>}
          {result && (
            <>
              <div className="summary">
                <div><small>Input</small><strong>{result.input_type}</strong></div>
                <div><small>Matches</small><strong>{result.recommendations.length}</strong></div>
                <div><small>Top confidence</small><strong>{top ? `${Math.round(top.relevance_score * 100)}%` : "—"}</strong></div>
              </div>
              <div className="notice">{result.compliance_summary}</div>

              {result.recommendations.map((s, i) => (
                <article className="card" key={s.is_number}>
                  <div className="card-head">
                    <div>
                      <span className="rank">#{i + 1}</span>
                      <span className="code">{s.is_number}</span>
                    </div>
                    <span className="score">{Math.round(s.relevance_score * 100)}%</span>
                  </div>
                  <h2>{s.title}</h2>
                  <p className="muted">{s.category} • {s.status}</p>
                  <p>{s.reason}</p>

                  <div className="grid">
                    <div><small>Current version</small><b>{s.current_version ?? "Not populated"}</b></div>
                    <div><small>Revision</small><b>{s.revision ?? "Not populated"}</b></div>
                    <div><small>Reviewed</small><b>{s.reviewed_year ?? "—"}</b></div>
                    <div><small>Reaffirmed</small><b>{s.reaffirmation_year ?? "—"}</b></div>
                  </div>

                  {s.amendments.length > 0 && <div className="section"><b>Amendments</b><ul>{s.amendments.map(a => <li key={a}>{a}</li>)}</ul></div>}

                  {s.certification.length > 0 && <div className="section"><b>Certification / Statutory Gate</b>{s.certification.map(c => <div className={c.mandatory ? "cert mandatory" : "cert"} key={c.name}><strong>{c.name}</strong><span>{c.mandatory ? "MANDATORY" : "VOLUNTARY / CONTEXTUAL"}</span><p>{c.details}</p>{c.qco_order && <p><b>Order:</b> {c.qco_order}</p>}</div>)}</div>}

                  {s.allied_standards.length > 0 && <div className="section"><b>Allied / Normative Standards</b>{s.allied_standards.map(a => <div className="allied" key={`${a.is_number}-${a.type}`}><code>{a.is_number}</code><span><b>{a.title}</b><br />{a.type}{a.reason ? ` • ${a.reason}` : ""}</span></div>)}</div>}

                  <div className="meta">Verified dataset date: {s.verified_on ?? "unknown"}{s.source_url ? <a href={s.source_url} target="_blank" rel="noreferrer">Official source</a> : null}</div>
                </article>
              ))}

              <article className="clause">
                <div className="clause-head"><b>Ready-to-Copy Tender Clause</b><button onClick={() => copy(result.tender_clause)}>Copy</button></div>
                <p>{result.tender_clause}</p>
              </article>
            </>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
