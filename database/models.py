from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class IndianStandard(Base):
    __tablename__ = "indian_standards"

    id = Column(Integer, primary_key=True, index=True)
    is_code = Column(String, unique=True, index=True, nullable=False) # e.g., "IS 4985:2021"
    title = Column(String, nullable=False) # e.g., "Unplasticized PVC Pipes"
    department = Column(String, index=True) # e.g., "Plumbing", "Electrical"
    
    # Tier 1 Gate: If True, the agent MUST flag this in the final output
    is_qco_mandatory = Column(Boolean, default=False) 
    
    # Text description used later for your ChromaDB vector embeddings
    description = Column(Text, nullable=True)

    # Relationships for Tier 3 Normative Standards
    normative_standards = relationship(
        "StandardDependency",
        foreign_keys="[StandardDependency.primary_code_id]",
        back_populates="primary_standard"
    )

class StandardDependency(Base):
    """Mapping table to link Tier 2 Primary codes to Tier 3 Normative testing codes."""
    __tablename__ = "standard_dependencies"

    id = Column(Integer, primary_key=True, index=True)
    primary_code_id = Column(Integer, ForeignKey("indian_standards.id"))
    normative_code_id = Column(Integer, ForeignKey("indian_standards.id"))
    dependency_reason = Column(String) # e.g., "Method of Test for Pressure"

    primary_standard = relationship("IndianStandard", foreign_keys=[primary_code_id])
