import { useState, useRef, useEffect, useCallback } from "react"
import SlideshowBackground from "./Slideshow"
import TopNavbar from "./TopNavbar"
import { ComplianceStatus,TrafficLight } from "./TrafficLight"
// ─── Types ────────────────────────────────────────────────────────────────────


type ApiResponse = {
  qco_mandatory: boolean
  tier_1_status: string
  tier_2_primary: string
  tier_3_normative: string[]
  tender_clause: string
}

type Message = {
  id: string
  role: "user" | "ai"
  content: string
  thinking?: boolean
  response?: ApiResponse
}

// ─── Static data ──────────────────────────────────────────────────────────────

const MOCK_RESPONSE: ApiResponse = {
  qco_mandatory: true,
  tier_1_status:
    "Mandatory QCO active under Electrical Wires and Cables (Quality Control) Order, 2023",
  tier_2_primary:
    "IS 694:2010 — PVC Insulated Cables and Flexible Cords rated up to 1100V",
  tier_3_normative: [
    "IS 10810:1984 — Methods of Test for Cables (Part 1–58)",
    "IS 8130:2013 — Conductors for Insulated Electric Cables and Flexible Cords",
    "IS 5831:1984 — PVC Insulation and Sheath of Electric Cables",
  ],
  tender_clause:
    "The bidder shall supply 1100V Grade PVC Insulated Copper Wires strictly conforming to IS 694:2010 as amended up to date, manufactured by a BIS-licensed manufacturer holding a valid BIS Licence under the Quality Control Order for Electrical Wires and Cables issued by the Ministry of Commerce and Industry. The bidder shall furnish a copy of the valid BIS Licence along with the technical bid. Products not bearing the ISI Mark shall be summarily rejected. Test reports from NABL-accredited laboratories conforming to IS 10810:1984 shall be mandatory for lot acceptance.",
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Good morning. I am your QCO Compliance and IS Standards assistant. Enter your procurement specification and I will identify applicable IS codes, check mandatory QCO orders, and generate a ready-to-copy tender clause.",
  },
  {
    id: "2",
    role: "user",
    content:
      "Procurement of 1100V PVC insulated copper cables for building wiring",
    response: MOCK_RESPONSE,
  },
  {
    id: "3",
    role: "ai",
    content:
      "I've analysed your specification. A **mandatory QCO order** is in force for this category. IS 694:2010 is the primary standard. The tender clause has been generated in the panel — you can copy it directly into your tender PDF.",
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────

function useCopyText(text: string) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return { copied, copy }
}


// ─── QCO Mandatory Badge ──────────────────────────────────────────────────────

function QCOMandatoryBadge({ mandatory }: { mandatory: boolean }) {
  if (!mandatory) return null
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
      style={{
        background: "rgba(155,53,53,0.08)",
        border: "1.5px solid rgba(155,53,53,0.28)",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(155,53,53,0.14)" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 2L1.5 12h11L7 2z"
            stroke="#9b3535"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M7 6v3M7 10.5v.5"
            stroke="#9b3535"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <div
          className="text-xs font-bold uppercase tracking-wider"
          style={{
            color: "#7c1d1d",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          Statutory QCO Alert
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          This category is subject to a mandatory Quality Control Order.
          ISI-marked goods only.
        </div>
      </div>
    </div>
  )
}

// ─── Tiered Standards Cards ───────────────────────────────────────────────────

function TierCard({
  tier,
  label,
  color,
  bg,
  border,
  content,
}: {
  tier: string
  label: string
  color: string
  bg: string
  border: string
  content: string | string[]
}) {
  const items = Array.isArray(content) ? content : [content]
  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
          style={{
            background: border,
            color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
          }}
        >
          {tier}
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color, fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item, i) => (
          <p key={i} className="text-sm text-slate-700 leading-snug">
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

function TieredStandardsBreakdown({ response }: { response: ApiResponse }) {
  return (
    <div className="flex flex-col gap-2.5">
      <TierCard
        tier="Tier 1"
        label="Mandatory"
        color="#7c1d1d"
        bg="rgba(155,53,53,0.05)"
        border="rgba(155,53,53,0.22)"
        content={response.tier_1_status}
      />
      <TierCard
        tier="Tier 2"
        label="Primary Standard"
        color="#1e3a5f"
        bg="rgba(30,58,95,0.05)"
        border="rgba(30,58,95,0.2)"
        content={response.tier_2_primary}
      />
      <TierCard
        tier="Tier 3"
        label="Normative References"
        color="#475569"
        bg="rgba(71,85,105,0.05)"
        border="rgba(71,85,105,0.18)"
        content={response.tier_3_normative}
      />
    </div>
  )
}

// ─── Clause Output Box ────────────────────────────────────────────────────────

function ClauseOutputBox({ clause }: { clause: string }) {
  const { copied, copy } = useCopyText(clause)
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(45,90,142,0.22)",
        background: "rgba(245,249,255,0.85)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          borderBottom: "1px solid rgba(45,90,142,0.14)",
          background: "rgba(30,58,95,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect
              x="1.5"
              y="1.5"
              width="10"
              height="10"
              rx="1.5"
              stroke="#2d5a8e"
              strokeWidth="1.3"
            />
            <path
              d="M3.5 4.5h6M3.5 6.5h6M3.5 8.5h4"
              stroke="#2d5a8e"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="text-xs font-semibold text-slate-600"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Tender Clause — Ready to Copy
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: copied ? "rgba(46,125,82,0.12)" : "rgba(30,58,95,0.1)",
            color: copied ? "#1a5c38" : "#1e3a5f",
            border: `1px solid ${
              copied ? "rgba(46,125,82,0.25)" : "rgba(30,58,95,0.2)"
            }`,
          }}
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M1.5 5.5l3 3 5-5"
                  stroke="#1a5c38"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect
                  x="3.5"
                  y="3.5"
                  width="6"
                  height="6"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M1.5 7.5V2a.5.5 0 01.5-.5h5.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-slate-700 leading-relaxed select-all">
          {clause}
        </p>
      </div>
    </div>
  )
}

// ─── Right panel: Standards & Clause ─────────────────────────────────────────

function ComplianceBanner({
  status,
  onStatusChange,
}: {
  status: ComplianceStatus
  onStatusChange: (s: ComplianceStatus) => void
}) {
  const cfg = {
    compliant: {
      bg: "rgba(46,125,82,0.07)",
      border: "rgba(46,125,82,0.18)",
      labelColor: "#1a5c38",
      label: "Compliant",
      desc: "All QCO checks passed. Document ready for tender issuance.",
    },
    partial: {
      bg: "rgba(154,114,0,0.06)",
      border: "rgba(154,114,0,0.18)",
      labelColor: "#624800",
      label: "Under Review",
      desc: "QCO order detected. Verify bidder licence before issuance.",
    },
    "non-compliant": {
      bg: "rgba(155,53,53,0.06)",
      border: "rgba(155,53,53,0.16)",
      labelColor: "#7c1d1d",
      label: "Non-Compliant",
      desc: "Specification gaps identified. Revision required.",
    },
  }[status]

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <TrafficLight status={status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{
              color: cfg.labelColor,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.09em",
            }}
          >
            QCO Status
          </span>
          <span className="text-sm font-bold text-slate-800">{cfg.label}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{cfg.desc}</p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        {(["compliant", "partial", "non-compliant"] as ComplianceStatus[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                background: status === s ? "#1e3a5f" : "rgba(0,0,0,0.04)",
                color: status === s ? "white" : "#64748b",
                border: status === s ? "none" : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {s === "compliant"
                ? "Compliant"
                : s === "partial"
                  ? "Partial"
                  : "Non-Compliant"}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

function RightPanel({
  complianceStatus,
  onStatusChange,
  latestResponse,
}: {
  complianceStatus: ComplianceStatus
  onStatusChange: (s: ComplianceStatus) => void
  latestResponse: ApiResponse | null
}) {
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "rgba(250,252,255,0.93)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-2.5 shrink-0 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect
            x="1.5"
            y="1.5"
            width="9"
            height="9"
            rx="1.5"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <path
            d="M3.5 4.5h5M3.5 6.5h5M3.5 8.5h3"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="text-xs font-medium tracking-widest uppercase text-slate-400"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em",
          }}
        >
          Standards Breakdown & Tender Clause
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-subtle px-4 py-4 flex flex-col gap-4">
        {/* QCO Compliance Banner */}
        <ComplianceBanner
          status={complianceStatus}
          onStatusChange={onStatusChange}
        />

        {latestResponse ? (
          <>
            {/* Red Statutory QCO Badge */}
            <QCOMandatoryBadge mandatory={latestResponse.qco_mandatory} />

            {/* Tiered Standards Breakdown */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.09em",
                }}
              >
                IS Standards Breakdown
              </p>
              <TieredStandardsBreakdown response={latestResponse} />
            </div>

            {/* Clause Output */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2.5"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.09em",
                }}
              >
                Generated Tender Clause
              </p>
              <ClauseOutputBox clause={latestResponse.tender_clause} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(30,58,95,0.07)",
                border: "1px solid rgba(30,58,95,0.12)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="3"
                  width="16"
                  height="18"
                  rx="2"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 8h8M8 12h8M8 16h5"
                  stroke="#94a3b8"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-400 text-center leading-relaxed max-w-xs">
              Enter a procurement specification in the chat to generate IS code
              recommendations and a tender clause.
            </p>
          </div>
        )}
      </div>

      {/* Export toolbar */}
      {latestResponse && (
        <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100/80 shrink-0">
          <ExportToolbar clause={latestResponse.tender_clause} />
        </div>
      )}
    </div>
  )
}

function ExportToolbar({ clause }: { clause: string }) {
  const { copied, copy } = useCopyText(clause)
  return (
    <>
      <button
        onClick={copy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2 6.5l3 3 6-6"
                stroke="#2e7d52"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ color: "#2e7d52" }}>Copied</span>
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect
                x="4.5"
                y="4.5"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M1.5 9V2.5a1 1 0 011-1H9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            Copy Clause
          </>
        )}
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path
            d="M6.5 1.5v7M3.5 5.5l3 3 3-3M1.5 10v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Export Tender PDF
      </button>
      <div
        className="ml-auto text-xs text-slate-400"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        POST /api/recommend/ · 2026-09-05
      </div>
    </>
  )
}

// ─── Chat components ──────────────────────────────────────────────────────────

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end mb-3">
      <div
        className="max-w-[82%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
        style={{
          background: "linear-gradient(135deg, #2d5a8e 0%, #1e3a5f 100%)",
          boxShadow: "0 2px 12px rgba(30,58,95,0.32)",
        }}
      >
        {content}
      </div>
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex gap-1.5 items-center py-0.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: "rgba(255,255,255,0.6)",
            animation: `thinking-pulse 1.3s ease-in-out ${i * 0.22}s infinite`,
          }}
        />
      ))}
      <span
        className="text-xs text-white/45 ml-1.5"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        Consulting IS database…
      </span>
    </div>
  )
}

function AIMessage({
  content,
  thinking,
}: {
  content: string
  thinking?: boolean
}) {
  const render = (text: string) => text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i} className="font-semibold text-white">
          {p.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{p}</span>
      ),
    )

  return (
    <div className="flex gap-3 mb-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle
            cx="7"
            cy="7"
            r="5.5"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1.4"
          />
          <path
            d="M4.5 7.5l2 2L9.5 5"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className="flex-1 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {thinking ? (
          <ThinkingDots />
        ) : (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            {render(content)}
          </p>
        )}
      </div>
    </div>
  )
}

// API Response inline summary card shown in chat
function ResponseSummaryCard({ response }: { response: ApiResponse }) {
  return (
    <div
      className="mb-3 ml-11 rounded-xl px-3.5 py-3 text-xs"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.13)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {response.qco_mandatory && (
          <span
            className="px-2 py-0.5 rounded-md font-bold"
            style={{
              background: "rgba(155,53,53,0.3)",
              color: "#fca5a5",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
          >
            QCO MANDATORY
          </span>
        )}
        <span className="text-white/50">Standards found</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded text-white/40"
            style={{
              background: "rgba(155,53,53,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
            }}
          >
            T1
          </span>
          <span className="text-white/65 leading-snug">
            {response.tier_1_status}
          </span>
        </div>
        <div className="flex gap-1.5">
          <span
            className="px-1.5 py-0.5 rounded text-white/40"
            style={{
              background: "rgba(30,58,95,0.35)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
            }}
          >
            T2
          </span>
          <span className="text-white/65 leading-snug">
            {response.tier_2_primary}
          </span>
        </div>
      </div>
    </div>
  )
}

// Error / validation alert
function ValidationError({ message }: { message: string }) {
  return (
    <div
      className="mx-4 mb-3 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm"
      style={{
        background: "rgba(155,53,53,0.12)",
        border: "1px solid rgba(155,53,53,0.25)",
        color: "rgba(252,165,165,0.9)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M7 4.5v3M7 9.5v.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      {message}
    </div>
  )
}

function ChatInputArea({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (disabled) return
    const trimmed = value.trim()
    if (trimmed.length < 5) {
      setError("Specification must be at least 5 characters long.")
      return
    }
    setError("")
    onSend(trimmed)
    setValue("")
    if (ref.current) ref.current.style.height = "auto"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    if (ref.current) {
      ref.current.style.height = "auto"
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 120)}px`
    }
    if (error) setError("")
  }

  return (
    <div
      className="shrink-0"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.09)",
        background: "rgba(0,0,0,0.18)",
        backdropFilter: "blur(12px)",
      }}
    >
      {error && <ValidationError message={error} />}
      <div className="px-4 pt-3 pb-3.5">
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.09)",
            border: `1px solid ${
              error ? "rgba(155,53,53,0.45)" : "rgba(255,255,255,0.15)"
            }`,
          }}
        >
          {/* Pen cursor icon */}
          <svg
            className="shrink-0 mb-0.5"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M10 2.5l2.5 2.5-7.5 7.5H2.5v-2.5L10 2.5z"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M8.25 4.25l2.5 2.5"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={disabled}
            placeholder="e.g. Procurement of 1100V PVC insulated copper cables for building wiring…"
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
            style={{
              minHeight: 22,
              maxHeight: 120,
              fontFamily: "'Inter', sans-serif",
              color: "rgba(255,255,255,0.88)",
              opacity: disabled ? 0.5 : 1,
            }}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background:
                !disabled && value.trim()
                  ? "linear-gradient(135deg, #2d5a8e, #1e3a5f)"
                  : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {disabled ? (
              // Spinner
              <svg
                className="animate-spin"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <circle
                  cx="6.5"
                  cy="6.5"
                  r="5"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                />
                <path
                  d="M6.5 1.5a5 5 0 015 5"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1.5 11.5L6.5 1.5l5 10-5-3-5 3z"
                  fill="white"
                  fillOpacity={value.trim() ? 1 : 0.25}
                />
              </svg>
            )}
          </button>
        </div>
        <p
          className="text-center text-xs text-white/25 mt-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          ⏎ analyse · shift+⏎ newline · min 5 chars
        </p>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [complianceStatus, setComplianceStatus] =
    useState<ComplianceStatus>("partial")
  const [isThinking, setIsThinking] = useState(false)
  const [splitPercent, setSplitPercent] = useState(44)
  const [latestResponse, setLatestResponse] = useState<ApiResponse | null>(
    MOCK_RESPONSE,
  )
  const chatEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const handleSend = useCallback(
    (content: string) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "user", content },
      ])
      setIsThinking(true)

      // Simulate POST /api/recommend/
      setTimeout(() => {
        const mockResp: ApiResponse = {
          qco_mandatory: true,
          tier_1_status:
            "Mandatory QCO active under Electrical Wires and Cables (Quality Control) Order, 2023",
          tier_2_primary:
            "IS 694:2010 — PVC Insulated Cables and Flexible Cords rated up to 1100V",
          tier_3_normative: [
            "IS 10810:1984 — Methods of Test for Cables",
            "IS 8130:2013 — Conductors for Insulated Electric Cables",
            "IS 5831:1984 — PVC Insulation and Sheath of Electric Cables",
          ],
          tender_clause:
            "The bidder shall supply 1100V Grade PVC Insulated Copper Wires strictly conforming to IS 694:2010 as amended, manufactured by a BIS-licensed manufacturer holding a valid BIS Licence under the Quality Control Order for Electrical Wires and Cables issued by the Ministry of Commerce and Industry. The bidder shall furnish a copy of the valid BIS Licence with the technical bid. Products not bearing the ISI Mark shall be summarily rejected. Test reports from NABL-accredited laboratories conforming to IS 10810:1984 are mandatory for lot acceptance.",
        }
        setIsThinking(false)
        setLatestResponse(mockResp)
        setComplianceStatus("partial")
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content:
              "Analysis complete. A **mandatory QCO order** applies to this category — only ISI-marked goods are permissible. The IS code breakdown and ready-to-copy tender clause have been generated in the right panel.",
            response: mockResp,
          },
        ])
      }, 2600)
    },
    [],
  )

  // Resizable divider
  const handleDividerDown = (e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setSplitPercent(
        Math.max(
          28,
          Math.min(64, ((ev.clientX - rect.left) / rect.width) * 100),
        ),
      )
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", background: "#06101e" }}
    >
      <TopNavbar />

      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* Left: Chat */}
        <div
          className="relative flex flex-col overflow-hidden shrink-0"
          style={{ width: `${splitPercent}%` }}
        >
          <SlideshowBackground />
          <div className="relative z-10 flex flex-col h-full">
            <div
              className="px-5 py-2.5 shrink-0 flex items-center gap-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                />
                <path
                  d="M6 3.5v2.5l1.5 1.5"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                Specification Input
              </span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserMessage key={msg.id} content={msg.content} />
                ) : (
                  <AIMessage key={msg.id} content={msg.content} />
                ),
              )}
              {/* Show inline response summary after user messages that have one */}
              {messages
                .filter((m) => m.role === "user" && m.response)
                .map((m) => (
                  <ResponseSummaryCard
                    key={`summary-${m.id}`}
                    response={m.response!}
                  />
                ))}
              {isThinking && <AIMessage content="" thinking />}
              <div ref={chatEndRef} />
            </div>
            <ChatInputArea onSend={handleSend} disabled={isThinking} />
          </div>
        </div>

        {/* Drag divider */}
        <div
          className="shrink-0 flex items-center justify-center cursor-col-resize z-20"
          style={{ width: 5, background: "rgba(255,255,255,0.04)" }}
          onMouseDown={handleDividerDown}
        >
          <div
            className="w-0.5 h-10 rounded-full"
            style={{ background: "rgba(255,255,255,0.16)" }}
          />
        </div>

        {/* Right: Standards & Clause */}
        <div className="flex-1 overflow-hidden">
          <RightPanel
            complianceStatus={complianceStatus}
            onStatusChange={setComplianceStatus}
            latestResponse={latestResponse}
          />
        </div>
      </div>
    </div>
  )
}