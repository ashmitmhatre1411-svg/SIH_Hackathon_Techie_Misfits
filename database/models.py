from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class IndianStandard(Base):
    __tablename__ = "indian_standards"

    id = Column(Integer, primary_key=True, index=True)
    is_code = Column(String(120), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False)
    department = Column(String(120), index=True, nullable=False)
    description = Column(Text, nullable=True)

    # Version / currency metadata. These are data fields, not AI-generated claims.
    current_version = Column(String(120), nullable=True)
    revision = Column(String(120), nullable=True)
    amendments_json = Column(Text, default="[]")
    reviewed_year = Column(Integer, nullable=True)
    reaffirmation_year = Column(Integer, nullable=True)
    certification_type = Column(String(120), nullable=True)
    certification_mandatory = Column(Boolean, default=False)
    certification_details = Column(Text, nullable=True)
    qco_order = Column(String(500), nullable=True)
    source_url = Column(String(1000), nullable=True)
    verified_on = Column(String(30), nullable=True)

    normative_standards = relationship(
        "StandardDependency",
        foreign_keys="[StandardDependency.primary_code_id]",
        back_populates="primary_standard",
        cascade="all, delete-orphan",
    )


class StandardDependency(Base):
    __tablename__ = "standard_dependencies"

    id = Column(Integer, primary_key=True, index=True)
    primary_code_id = Column(Integer, ForeignKey("indian_standards.id"), nullable=False)
    normative_code_id = Column(Integer, ForeignKey("indian_standards.id"), nullable=False)
    dependency_type = Column(String(80), nullable=False, default="normative_reference")
    dependency_reason = Column(String(500), nullable=True)

    primary_standard = relationship(
        "IndianStandard",
        foreign_keys=[primary_code_id],
        back_populates="normative_standards",
    )
    normative_standard = relationship(
        "IndianStandard",
        foreign_keys=[normative_code_id],
    )
