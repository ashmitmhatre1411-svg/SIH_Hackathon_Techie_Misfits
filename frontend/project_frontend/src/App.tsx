import { useState, useRef, useEffect, useCallback } from "react"
import SlideshowBackground from "./Slideshow"
import TopNavbar from "./TopNavbar"
import { ApiResponse } from "./TieredStandardsCards"
import { ComplianceStatus } from "./ComplianceStatus"
import RightPanel from "./RightPanel"
import { UserMessage,AIMessage,ResponseSummaryCard,ChatInputArea } from "./ChatComponents"
// ─── Types ────────────────────────────────────────────────────────────────────

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