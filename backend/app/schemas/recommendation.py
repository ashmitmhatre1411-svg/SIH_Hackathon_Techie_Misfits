from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    specification: str = Field(
        ...,
        min_length=3,
        description="Free-text product description or tender specification."
    )
    domain: str | None = Field(
        default=None,
        description="Optional domain filter, e.g. 'Electrical', 'Civil'."
    )


class StandardRecommendation(BaseModel):
    is_number: str
    title: str
    category: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    reason: str
    status: str
    related_standards: list[str] = Field(default_factory=list)


class RecommendationResponse(BaseModel):
    query: str
    recommendations: list[StandardRecommendation]
