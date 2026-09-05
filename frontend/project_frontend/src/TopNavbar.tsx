export default function TopNavbar() {
  return (
    <div
      className="flex items-center justify-between px-6 h-14 shrink-0"
      style={{
        background:
          "linear-gradient(90deg, #060d1b 0%, #0d1a2e 60%, #102035 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 18px rgba(0,0,0,0.32)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #2d5a8e 0%, #4a7fb5 100%)",
            boxShadow: "0 2px 12px rgba(45,90,142,0.38)",
          }}
        >
          {/* BIS-style document + seal icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect
              x="3"
              y="2"
              width="12"
              height="14"
              rx="1.5"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M6 6.5h6M6 9h6M6 11.5h4"
              stroke="white"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <circle
              cx="13.5"
              cy="13.5"
              r="3"
              fill="#2d5a8e"
              stroke="white"
              strokeWidth="1.2"
            />
            <path
              d="M12.3 13.5l.9.9 1.5-1.5"
              stroke="white"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <span
            className="text-white font-bold text-sm tracking-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            TenderAI
          </span>
          <span
            className="text-white/35 text-xs ml-2"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            QCO · IS Standards · Clause Generator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(46,125,82,0.12)",
            border: "1px solid rgba(46,125,82,0.22)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#2e7d52" }}
          />
          <span
            className="text-xs font-medium"
            style={{
              color: "#4ade80",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Live · POST /api/recommend/
          </span>
        </div>
        <div className="w-px h-5 bg-white/10 mx-0.5" />
        <div className="text-right">
          <div
            className="text-white/80 text-xs font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Team Nexus
          </div>
          <div
            className="text-white/35 text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            SIH 2026
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ml-0.5"
          style={{
            background: "linear-gradient(135deg, #4a7c59, #2e7d52)",
            boxShadow: "0 2px 8px rgba(46,125,82,0.28)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          TN
        </div>
      </div>
    </div>
  )
}