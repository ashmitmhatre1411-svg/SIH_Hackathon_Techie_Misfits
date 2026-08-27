from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
    StandardRecommendation
)


def recommend_standards(
    request: RecommendationRequest
) -> RecommendationResponse:

    specification = request.specification.lower()

    recommendations = []

    # -----------------------------------------------
    # Temporary rule-based logic
    # -----------------------------------------------

    if "led" in specification or "street light" in specification:

        recommendations.append(
            StandardRecommendation(
                is_number="IS XXXXX",
                title="LED Lighting Requirements",
                category="Electrical / Lighting",
                relevance_score=0.94,
                reason=(
                    "The specification contains LED lighting and "
                    "street-lighting requirements."
                ),
                status="Active",
                related_standards=[
                    "IS YYYYY",
                    "IS ZZZZZ"
                ]
            )
        )

    if "electrical" in specification or "220v" in specification:

        recommendations.append(
            StandardRecommendation(
                is_number="IS YYYYY",
                title="Electrical Safety Requirements",
                category="Electrical",
                relevance_score=0.87,
                reason=(
                    "The specification contains electrical "
                    "voltage and safety-related requirements."
                ),
                status="Active",
                related_standards=[
                    "IS XXXXX"
                ]
            )
        )

    if "ip66" in specification:

        recommendations.append(
            StandardRecommendation(
                is_number="IS ZZZZZ",
                title="Protection Against Environmental Conditions",
                category="Protection / Enclosure",
                relevance_score=0.82,
                reason=(
                    "The specification requires IP66 protection, "
                    "indicating environmental protection requirements."
                ),
                status="Active",
                related_standards=[]
            )
        )

    # -----------------------------------------------
    # If nothing matched
    # -----------------------------------------------

    if not recommendations:

        recommendations.append(
            StandardRecommendation(
                is_number="NO_MATCH",
                title="No standard found",
                category="Unknown",
                relevance_score=0.0,
                reason=(
                    "No matching standards were found in the "
                    "current prototype dataset."
                ),
                status="Unknown",
                related_standards=[]
            )
        )

    # -----------------------------------------------
    # Sort by relevance
    # -----------------------------------------------

    recommendations.sort(
        key=lambda x: x.relevance_score,
        reverse=True
    )

    return RecommendationResponse(
        query=request.specification,
        recommendations=recommendations
    )