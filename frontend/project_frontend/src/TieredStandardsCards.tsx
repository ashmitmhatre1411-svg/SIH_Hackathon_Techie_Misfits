export type ApiResponse = {
  qco_mandatory: boolean
  tier_1_status: string
  tier_2_primary: string
  tier_3_normative: string[]
  tender_clause: string
}

export function TierCard({
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

export function TieredStandardsBreakdown({ response }: { response: ApiResponse }) {
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