import os
import json
from google import genai
from google.genai import types
from ai.tools import search_bis_standards, verify_qco_gate
from ai.sanitizer import sanitize_and_validate

SYSTEM_INSTRUCTIONS = """You are a specialized Indian Standards (BIS) Statutory & Quality Compliance ReAct Agent.

You must follow this step-by-step reasoning process:
1. Parse the procurement specification.
2. Execute `search_bis_standards` to locate matching standards across Tier 1, Tier 2, and Tier 3.
3. Execute `verify_qco_gate` for each identified primary IS Code to confirm legal compliance status.
4. Synthesize findings into a final compliance payload.

STRICT OUTPUT FORMAT: Reply ONLY with a valid JSON object:
{
  "is_codes": ["IS XXXX:YYYY"],
  "qco_mandatory": true,
  "tier_1_status": "string description",
  "tier_2_primary": "string description",
  "tier_3_normative": ["string listing normative standards"],
  "tender_clause": "Official statutory compliance clause text for public procurement."
}
"""

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))

def run_compliance_agent(specification: str) -> dict:
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Analyze spec and generate compliance clause: '{specification}'",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTIONS,
                tools=[search_bis_standards, verify_qco_gate],
                temperature=0.0,
            )
        )
        return sanitize_and_validate(response.text)

    except Exception as e:
        return {
            "error": "ReAct agent pipeline execution failed",
            "details": str(e)
        }

if __name__ == "__main__":
    sample_spec = "Procurement of PVC insulated copper cables for electrical wiring."
    print(json.dumps(run_compliance_agent(sample_spec), indent=2))