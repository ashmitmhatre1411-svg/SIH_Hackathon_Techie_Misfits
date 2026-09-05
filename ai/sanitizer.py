import re
import json

IS_CODE_REGEX = re.compile(r"IS\s+\d+(?:\s*\([^)]+\))?:\d{4}")

def sanitize_and_validate(agent_output: str) -> dict:
    clean_str = agent_output.strip().removeprefix("```json").removesuffix("```").strip()
    
    try:
        data = json.loads(clean_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Output Sanitization Gate failed: Invalid JSON structure -> {e}")

    raw_codes = data.get("is_codes", [])
    valid_codes = []
    
    for code in raw_codes:
        match = IS_CODE_REGEX.search(str(code))
        if match:
            valid_codes.append(match.group(0))

    data["is_codes"] = valid_codes
    data["sanitized"] = True
    return data