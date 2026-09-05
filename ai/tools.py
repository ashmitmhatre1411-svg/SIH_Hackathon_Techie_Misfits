def search_bis_standards(query: str) -> dict:
    """
    Searches the database for matching Indian Standards (IS codes).
    Returns classified standards across Tier 1, Tier 2, and Tier 3.
    """
    mock_registry = {
        "led": {
            "tier_1_qco": "Mandatory QCO active under Electrical Equipment Order",
            "tier_2_primary": "IS 16102 (Part 1):2012 - Self-Ballasted LED Lamps",
            "tier_3_normative": ["IS 16102 (Part 2):2012 (Safety Requirements)"]
        },
        "cable": {
            "tier_1_qco": "Mandatory QCO active under Electrical Wires Order",
            "tier_2_primary": "IS 694:2010 - PVC Insulated Cables up to 1100V",
            "tier_3_normative": ["IS 10810:1984 (Methods of Test)"]
        },
        "pipe": {
            "tier_1_qco": "Mandatory QCO active under Plastic Piping Systems Order",
            "tier_2_primary": "IS 4985:2021 - Unplasticized PVC Pipes",
            "tier_3_normative": ["IS 12235:2004 (Methods of Test)"]
        }
    }

    for key, data in mock_registry.items():
        if key in query.lower():
            return data

    return {"error": "No matching standards found in database."}


def verify_qco_gate(is_code: str) -> str:
    """
    Verifies if a specific IS Code is governed by an active Tier 1 Statutory Quality Control Order.
    """
    mandatory_patterns = ["IS 16102", "IS 694", "IS 4985"]
    is_mandatory = any(pat in is_code for pat in mandatory_patterns)
    
    if is_mandatory:
        return f"TIER 1 GATE PASSED: {is_code} is under mandatory QCO enforcement."
    return f"TIER 2 WARNING: {is_code} is active but not under mandatory QCO enforcement."