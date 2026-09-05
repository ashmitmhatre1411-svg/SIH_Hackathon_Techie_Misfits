import useCopyText from "./CopyText"
export default function ExportToolbar({ clause }: { clause: string }) {
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