"""Deterministic seed data for the hackathon demo.

To add a new category later: add entries to SEED_STANDARDS (and
SEED_DEPENDENCIES if it references another standard) below. Nothing
else in the codebase needs to change — `department` is a free string
everywhere (DB column, API schema), not a hardcoded enum.

Run with:  python -m database.SeedScript   (from the repo root)
"""

from database.db import SessionLocal, init_db
from database.models import IndianStandard, StandardDependency

# ---------------------------------------------------------------
# DEMO CATEGORIES — edit this list to add/remove categories/standards.
# ---------------------------------------------------------------
SEED_STANDARDS = [
    # ---- Category 1: Electrical ----
    {
        "is_code": "IS 694:2010",
        "title": "PVC Insulated Cables for Working Voltages up to 1100V",
        "department": "Electrical",
        "is_qco_mandatory": True,
        "description": (
            "Requirements for PVC insulated copper/aluminium cables for "
            "electrical wiring up to 1100V, covering 220V household and "
            "industrial wiring."
        ),
    },
    {
        "is_code": "IS 10810:1984",
        "title": "Methods of Test for Cables",
        "department": "Electrical",
        "is_qco_mandatory": False,
        "description": "Normative test methods referenced when verifying cable performance under IS 694.",
    },
    # ---- Category 2: Plumbing / Civil ----
    {
        "is_code": "IS 4985:2021",
        "title": "Unplasticized PVC Pipes for Potable Water Supply",
        "department": "Plumbing",
        "is_qco_mandatory": True,
        "description": "Requirements for uPVC pipes used in potable water supply and civil plumbing works.",
    },
    # ---- Category 3: Lighting ----
    {
        "is_code": "IS 10322:2018",
        "title": "Luminaires - General Requirements",
        "department": "Lighting",
        "is_qco_mandatory": True,
        "description": (
            "Safety and performance requirements for LED and other "
            "luminaires, including street-lighting fixtures and IP66-rated "
            "enclosures."
        ),
    },
]

# (primary_is_code, normative_is_code, reason) — Tier 2 -> Tier 3 links
SEED_DEPENDENCIES = [
    ("IS 694:2010", "IS 10810:1984", "Method of Test for Cable Performance"),
]

# NOTE: verify these IS codes against the actual BIS database before using
# them anywhere real — they're placeholders picked for a plausible demo,
# not a verified citation.


def seed_database():
    init_db()
    db = SessionLocal()
    try:
        code_to_row = {}
        for entry in SEED_STANDARDS:
            existing = db.query(IndianStandard).filter_by(is_code=entry["is_code"]).first()
            if existing:
                code_to_row[entry["is_code"]] = existing
                continue
            row = IndianStandard(**entry)
            db.add(row)
            db.flush()  # assigns row.id without committing yet
            code_to_row[entry["is_code"]] = row

        for primary_code, normative_code, reason in SEED_DEPENDENCIES:
            primary = code_to_row[primary_code]
            normative = code_to_row[normative_code]
            already_linked = (
                db.query(StandardDependency)
                .filter_by(primary_code_id=primary.id, normative_code_id=normative.id)
                .first()
            )
            if not already_linked:
                db.add(StandardDependency(
                    primary_code_id=primary.id,
                    normative_code_id=normative.id,
                    dependency_reason=reason,
                ))

        db.commit()
        print(f"Seeded {len(SEED_STANDARDS)} standards, {len(SEED_DEPENDENCIES)} dependencies.")
    finally:
        db.close()


def seed_from_csv(filepath: str):
    """Kept for later, once you have more standards than fit comfortably
    in a Python list above. Expects columns: is_code, title, department,
    is_qco_mandatory, description."""
    import csv

    db = SessionLocal()
    try:
        with open(filepath, mode="r", newline="") as file:
            reader = csv.DictReader(file)
            for row in reader:
                if db.query(IndianStandard).filter_by(is_code=row["is_code"]).first():
                    continue
                db.add(IndianStandard(
                    is_code=row["is_code"],
                    title=row["title"],
                    department=row["department"],
                    is_qco_mandatory=row["is_qco_mandatory"].strip().lower() == "true",
                    description=row.get("description"),
                ))
        db.commit()
    finally:
        db.close()


def ingest_into_vectorstore():
    """Pushes whatever is in the relational DB into the vector store so
    semantic search (recommend_standards_semantic / search_bis_standards)
    can actually find it. Run this every time you reseed."""
    from ai.config import get_retriever

    db = SessionLocal()
    try:
        count = get_retriever().ingest(db)
        print(f"Ingested {count} standards into the vector store.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
    ingest_into_vectorstore()
