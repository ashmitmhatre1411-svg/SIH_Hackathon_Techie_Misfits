from sqlalchemy.orm import Session
from models import IndianStandard, StandardDependency

def seed_database(db: Session):
    # 1. Create Tier 2 & Tier 1 Primary Codes
    pvc_pipe = IndianStandard(
        is_code="IS 4985:2021",
        title="Unplasticized PVC Pipes for Water Supply",
        department="Plumbing",
        is_qco_mandatory=True, # Critical trigger for your LLM!
        description="Pipes used for cold water supply and anti-leakage drainage."
    )
    
    # 2. Create Tier 3 Normative Code
    testing_code = IndianStandard(
        is_code="IS 12235 (Part 1)",
        title="Methods of Test for Unplasticized PVC Pipes",
        department="Plumbing",
        is_qco_mandatory=False,
        description="Measurement of outside diameter and wall thickness."
    )
    
    db.add_all([pvc_pipe, testing_code])
    db.commit()

    # 3. Link Tier 3 to Tier 2
    dependency = StandardDependency(
        primary_code_id=pvc_pipe.id,
        normative_code_id=testing_code.id,
        dependency_reason="Mandatory testing parameters for dimensions."
    )
    db.add(dependency)
    db.commit()
    print("Database seeded with Tier 1, 2, and 3 standards!")
