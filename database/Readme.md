# Database Module

This directory manages the relational data for Indian Standards (IS), focusing on mapping primary codes to mandatory regulations and testing standards.

## Files
* `models.py`: Defines the SQLAlchemy ORM schema. 
    * `IndianStandard`: Stores the standard code, title, department, and the critical `is_qco_mandatory` flag (Tier 1).
    * `StandardDependency`: A mapping table linking Primary standards (Tier 2) to Normative testing standards (Tier 3).
* `SeedScript.py`: A utility script to populate the database with a deterministic set of realistic IS codes and QCO flags for hackathon testing and demo purposes.
