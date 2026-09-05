import { ApiResponse } from "./TieredStandardsCards"
import { useState,useRef } from "react"
// ─── Chat components ──────────────────────────────────────────────────────────

export function UserMessage({ content }: { content: string }) {
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

export function ThinkingDots() {
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

export function AIMessage({
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
export function ResponseSummaryCard({ response }: { response: ApiResponse }) {
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
export function ValidationError({ message }: { message: string }) {
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

export function ChatInputArea({
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