import {ComplianceStatus} from "./ComplianceStatus"

export default function TrafficLight({ status }: { status: ComplianceStatus }) {
  const lights = [
    {
      id: "non-compliant",
      active: "#9b3535",
      inactive: "rgba(155,53,53,0.16)",
      glow: "rgba(155,53,53,0.38)",
    },
    {
      id: "partial",
      active: "#9a7200",
      inactive: "rgba(154,114,0,0.16)",
      glow: "rgba(154,114,0,0.36)",
    },
    {
      id: "compliant",
      active: "#2e7d52",
      inactive: "rgba(46,125,82,0.16)",
      glow: "rgba(46,125,82,0.38)",
    },
  ]
  return (
    <div
      className="flex flex-col items-center gap-2.5 px-3.5 py-4 rounded-2xl shrink-0"
      style={{
        background: "linear-gradient(180deg, #16202e 0%, #0d1520 100%)",
        boxShadow:
          "0 6px 24px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.05)",
        width: 46,
      }}
    >
      {lights.map((l) => {
        const isOn = l.id === status
        return (
          <div
            key={l.id}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: isOn ? l.active : l.inactive,
              boxShadow: isOn
                ? `0 0 0 2px ${l.active}44, 0 0 14px 4px ${l.glow}, inset 0 2px 4px rgba(255,255,255,0.2)`
                : "inset 0 2px 4px rgba(0,0,0,0.2)",
              transition: "all 0.55s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        )
      })}
    </div>
  )
}

