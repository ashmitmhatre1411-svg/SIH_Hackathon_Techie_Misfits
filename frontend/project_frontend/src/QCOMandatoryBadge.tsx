export default function QCOMandatoryBadge({ mandatory }: { mandatory: boolean }) {
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