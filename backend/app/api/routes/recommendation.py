from fastapi import APIRouter

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse
)

from app.services.recommendation_service import (
    recommend_standards
)


router = APIRouter(
    prefix="/recommend",
    tags=["Recommendations"]
)


@router.post(
    "/",
    response_model=RecommendationResponse
)
def get_recommendations(
    request: RecommendationRequest
):

    result = recommend_standards(request)

    return result