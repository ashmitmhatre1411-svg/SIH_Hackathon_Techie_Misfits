"""Demo/curated standards catalogue for three hackathon categories.

IMPORTANT: This is a demo catalogue, not a legal database. Every row carries
source_url + verified_on so the UI can distinguish verified metadata from AI text.
For production, replace/extend this catalogue with a scheduled official BIS sync.
"""
import json
from database.db import SessionLocal, init_db
from database.models import IndianStandard, StandardDependency

VERIFIED_ON = "2026-09-05"

SEED_STANDARDS = [
    # ---------------- Electrical ----------------
    {
        "is_code": "IS 694:2010",
        "title": "Polyvinyl chloride insulated unsheathed and sheathed cables/cords with rigid and flexible conductor for rated voltages up to and including 1100 V",
        "department": "Electrical",
        "description": "PVC insulated cables and cords up to 1100 V for electrical wiring and related applications.",
        "current_version": "IS 694:2010",
        "revision": "Fourth Revision",
        "amendments_json": "[]",
        "reviewed_year": 2020,
        "certification_type": "BIS Product Certification / ISI Mark",
        "certification_mandatory": True,
        "certification_details": "Listed by BIS under the Cables Quality Control Order catalogue.",
        "qco_order": "Cables (Quality Control) Order",
        "source_url": "https://www.bis.gov.in/wp-content/uploads/2021/09/Indian-Standards-on-Power-Energy-sector.pdf",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 10810 (Part 6):1984",
        "title": "Methods of test for cables: Part 6 thickness of thermoplastic and elastomeric insulation and sheath",
        "department": "Electrical",
        "description": "Cable test method used as an allied testing reference for cable specifications.",
        "current_version": "IS 10810 (Part 6):1984",
        "revision": "New Standard",
        "amendments_json": "[]",
        "reviewed_year": 2021,
        "certification_type": "N/A",
        "certification_mandatory": False,
        "source_url": "https://standards.bis.gov.in/",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 8130:2013",
        "title": "Conductors for insulated electric cables and flexible cords",
        "department": "Electrical",
        "description": "Requirements for conductors used in insulated electric cables and flexible cords.",
        "current_version": "IS 8130:2013",
        "revision": "Third Revision",
        "amendments_json": "[]",
        "certification_type": "Allied product standard",
        "certification_mandatory": False,
        "source_url": "https://standards.bis.gov.in/",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 5831:1984",
        "title": "PVC insulation and sheath of electric cables",
        "department": "Electrical",
        "description": "Material requirements associated with PVC insulation and sheath of electric cables.",
        "current_version": "IS 5831:1984",
        "revision": "Current catalogue entry",
        "amendments_json": "[]",
        "certification_type": "Allied material standard",
        "certification_mandatory": False,
        "source_url": "https://standards.bis.gov.in/",
        "verified_on": VERIFIED_ON,
    },

    # ---------------- Plumbing / Civil ----------------
    {
        "is_code": "IS 4985:2021",
        "title": "Unplasticized PVC Pipes for Potable Water Supplies - Specification",
        "department": "Plumbing",
        "description": "uPVC pipes for potable water supply and civil plumbing applications, including dimensional, physical, chemical and mechanical requirements.",
        "current_version": "IS 4985:2021",
        "revision": "Fourth Revision",
        "amendments_json": json.dumps(["First Amendment: 2023"]),
        "reviewed_year": 2026,
        "reaffirmation_year": 2026,
        "certification_type": "BIS Product Certification",
        "certification_mandatory": False,
        "certification_details": "BIS standard page currently lists certification as voluntary; statutory requirements must be checked separately for the procurement context.",
        "qco_order": None,
        "source_url": "https://standards.bis.gov.in/",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 10148:2023",
        "title": "Positive list of constituents of PVC and its copolymers in contact with foodstuffs, pharmaceuticals and drinking water",
        "department": "Plumbing",
        "description": "Material/contact-safety reference for PVC applications involving drinking water.",
        "current_version": "IS 10148:2023",
        "revision": "Current catalogue entry",
        "amendments_json": "[]",
        "certification_type": "Normative / allied reference",
        "certification_mandatory": False,
        "source_url": "https://standards.bis.gov.in/",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 10151:2019",
        "title": "Polyvinyl chloride compounds for potable water applications",
        "department": "Plumbing",
        "description": "Material reference relevant to potable-water PVC products.",
        "current_version": "IS 10151:2019",
        "revision": "Current catalogue entry",
        "amendments_json": "[]",
        "certification_type": "Allied material standard",
        "certification_mandatory": False,
        "source_url": "https://standards.bis.gov.in/",
        "verified_on": VERIFIED_ON,
    },

    # ---------------- Lighting ----------------
    {
        "is_code": "IS 10322 (Part 5/Section 3):2012",
        "title": "Luminaires - Particular requirements - Luminaires for road and street lighting",
        "department": "Lighting",
        "description": "Particular requirements for LED luminaires used for road and street lighting, including safety and construction requirements.",
        "current_version": "IS 10322 (Part 5/Section 3):2012",
        "revision": "Current catalogue entry",
        "amendments_json": "[]",
        "certification_type": "BIS Compulsory Registration Scheme (CRS)",
        "certification_mandatory": True,
        "certification_details": "BIS Scheme II catalogue lists this standard for LED luminaires for road and street lighting.",
        "qco_order": "Electronics and IT Goods (Requirement for Compulsory Registration) Order / applicable CRS notification",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 10322 (Part 5/Section 5):2013",
        "title": "Luminaires - Particular requirements - Flood Lights",
        "department": "Lighting",
        "description": "Requirements for flood lights including mechanical strength, environmental protection, thermal management and electrical safety.",
        "current_version": "IS 10322 (Part 5/Section 5):2013",
        "revision": "Current catalogue entry",
        "amendments_json": "[]",
        "certification_type": "BIS Compulsory Registration Scheme (CRS)",
        "certification_mandatory": True,
        "certification_details": "BIS Scheme II catalogue lists this standard for LED flood lights.",
        "qco_order": "Electronics and IT Goods (Requirement for Compulsory Registration) Order / applicable CRS notification",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/",
        "verified_on": VERIFIED_ON,
    },
    {
        "is_code": "IS 10322 (Part 5/Section 1)",
        "title": "Luminaires - Particular requirements - Fixed general purpose luminaires",
        "department": "Lighting",
        "description": "General-purpose fixed luminaires reference for LED lighting products.",
        "current_version": "IS 10322 (Part 5/Section 1)",
        "revision": "Current BIS CRS catalogue entry",
        "amendments_json": "[]",
        "certification_type": "BIS Compulsory Registration Scheme (CRS)",
        "certification_mandatory": True,
        "certification_details": "Listed in BIS Scheme II for fixed general-purpose LED luminaires.",
        "source_url": "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/",
        "verified_on": VERIFIED_ON,
    },
]

SEED_DEPENDENCIES = [
    ("IS 694:2010", "IS 10810 (Part 6):1984", "test_method", "Cable thickness / insulation and sheath testing"),
    ("IS 694:2010", "IS 8130:2013", "allied_product", "Conductor requirements"),
    ("IS 694:2010", "IS 5831:1984", "material", "PVC insulation and sheath material"),
    ("IS 4985:2021", "IS 10148:2023", "normative_reference", "Potable-water contact material reference"),
    ("IS 4985:2021", "IS 10151:2019", "allied_material", "PVC material reference"),
    ("IS 10322 (Part 5/Section 3):2012", "IS 10322 (Part 5/Section 1)", "allied_product", "General-purpose luminaire requirements"),
    ("IS 10322 (Part 5/Section 5):2013", "IS 10322 (Part 5/Section 1)", "allied_product", "General-purpose luminaire requirements"),
]


def seed_database():
    init_db()
    db = SessionLocal()
    try:
        code_to_row = {}
        for entry in SEED_STANDARDS:
            row = db.query(IndianStandard).filter_by(is_code=entry["is_code"]).first()
            if row is None:
                row = IndianStandard(**entry)
                db.add(row)
                db.flush()
            else:
                for key, value in entry.items():
                    setattr(row, key, value)
            code_to_row[entry["is_code"]] = row

        for primary_code, normative_code, dep_type, reason in SEED_DEPENDENCIES:
            primary = code_to_row[primary_code]
            normative = code_to_row[normative_code]
            existing = db.query(StandardDependency).filter_by(
                primary_code_id=primary.id,
                normative_code_id=normative.id,
            ).first()
            if existing is None:
                db.add(StandardDependency(
                    primary_code_id=primary.id,
                    normative_code_id=normative.id,
                    dependency_type=dep_type,
                    dependency_reason=reason,
                ))
            else:
                existing.dependency_type = dep_type
                existing.dependency_reason = reason
        db.commit()
        print(f"Seeded/updated {len(SEED_STANDARDS)} standards and {len(SEED_DEPENDENCIES)} relationships.")
    finally:
        db.close()


def ingest_into_vectorstore():
    try:
        from ai.config import get_retriever
    except Exception as exc:
        print(f"Vector-store ingestion skipped: {exc}")
        return
    db = SessionLocal()
    try:
        print(f"Ingested {get_retriever().ingest(db)} standards into vector store.")
    except Exception as exc:
        print(f"Vector-store ingestion skipped: {exc}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
    ingest_into_vectorstore()
