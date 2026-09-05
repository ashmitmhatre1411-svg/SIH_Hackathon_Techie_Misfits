from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    specification: str = Field(..., min_length=3)
    domain: str | None = None


class AlliedStandard(BaseModel):
    is_number: str
    title: str
    type: str
    reason: str | None = None


class CertificationRequirement(BaseModel):
    name: str
    mandatory: bool
    details: str | None = None
    qco_order: str | None = None
    source_url: str | None = None


class StandardRecommendation(BaseModel):
    is_number: str
    title: str
    category: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    reason: str
    status: str
    current_version: str | None = None
    revision: str | None = None
    amendments: list[str] = Field(default_factory=list)
    reviewed_year: int | None = None
    reaffirmation_year: int | None = None
    certification: list[CertificationRequirement] = Field(default_factory=list)
    allied_standards: list[AlliedStandard] = Field(default_factory=list)
    source_url: str | None = None
    verified_on: str | None = None


class RecommendationResponse(BaseModel):
    query: str
    input_type: str = "text"
    recommendations: list[StandardRecommendation]
    compliance_summary: str
    tender_clause: str
