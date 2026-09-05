import useCopyText from "./CopyText"
// ─── Clause Output Box ────────────────────────────────────────────────────────
export default function ClauseOutputBox({ clause }: { clause: string }) {
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