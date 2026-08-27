from pydantic import BaseModel, Field
from typing import List, Optional


class RecommendationRequest(BaseModel):

    specification: str = Field(
        ...,
        min_length=5,
        description="Procurement specification provided by the user"
    )

    product: Optional[str] = None


class StandardRecommendation(BaseModel):

    is_number: str
    title: str
    category: str

    relevance_score: float = Field(
        ge=0,
        le=1
    )

    reason: str

    status: str

    related_standards: List[str] = []


class RecommendationResponse(BaseModel):

    query: str

    recommendations: List[StandardRecommendation]