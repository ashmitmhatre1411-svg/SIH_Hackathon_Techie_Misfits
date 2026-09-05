"""Tools the ReAct agent (agent.py) calls. These now go through
ai.config.get_retriever() instead of importing Chroma or
sentence-transformers by name. Swapping either later touches only
config.py, not this file."""

from database.db import SessionLocal
from database.models import IndianStandard, StandardDependency


def search_bis_standards(query: str, domain: str | None = None) -> dict:
    from ai.config import get_retriever

    matches = get_retriever().search(query, top_k=1, domain=domain)
    if not matches:
        return {"error": "No matching standards found in database."}

    top = matches[0]
    primary_code = top["is_code"]

    db = SessionLocal()
    try:
        deps = (
            db.query(StandardDependency)
            .join(IndianStandard, StandardDependency.primary_code_id == IndianStandard.id)
            .filter(IndianStandard.is_code == primary_code)
            .all()
        )
        normative_codes = []
        for dep in deps:
            normative_std = db.query(IndianStandard).get(dep.normative_code_id)
            if normative_std:
                normative_codes.append(f"{normative_std.is_code} ({dep.dependency_reason})")

        return {
            "tier_1_qco": (
                f"Mandatory QCO active for {primary_code}"
                if top.get("is_qco_mandatory")
                else f"{primary_code} is not currently under a mandatory QCO"
            ),
            "tier_2_primary": f"{primary_code} - {top['title']}",
            "tier_3_normative": normative_codes,
        }
    finally:
        db.close()


def verify_qco_gate(is_code: str) -> str:
    db = SessionLocal()
    try:
        standard = db.query(IndianStandard).filter_by(is_code=is_code).first()
        if standard is None:
            return f"UNKNOWN CODE: {is_code} not found in database."
        if standard.is_qco_mandatory:
            return f"TIER 1 GATE PASSED: {is_code} is under mandatory QCO enforcement."
        return f"TIER 2 WARNING: {is_code} is active but not under mandatory QCO enforcement."
    finally:
        db.close()
