from sqlalchemy.orm import Session

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
    StandardRecommendation
)

def recommend_standards_rulebased(
    request: RecommendationRequest
) -> RecommendationResponse:
    """Temporary rule-based fallback — kept for demo safety if the
    semantic path (recommend_standards_semantic) isn't ready yet."""

    specification = request.specification.lower()
    recommendations = []

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
                related_standards=["IS YYYYY", "IS ZZZZZ"]
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
                related_standards=["IS XXXXX"]
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

    if not recommendations:
        recommendations.append(
            StandardRecommendation(
                is_number="NO_MATCH",
                title="No standard found",
                category="Unknown",
                relevance_score=0.0,
                reason="No matching standards were found in the current prototype dataset.",
                status="Unknown",
                related_standards=[]
            )
        )

    recommendations.sort(key=lambda x: x.relevance_score, reverse=True)

    return RecommendationResponse(
        query=request.specification,
        recommendations=recommendations
    )


def recommend_standards_semantic(
    request: RecommendationRequest,
    db: Session
) -> RecommendationResponse:
    """Real semantic path — this is the logic that was mistakenly
    pasted into schemas/recommendation.py. It belongs here.

    Imports are local (not at module top) so this file — and the
    rule-based fallback below — still work even before ai/embeddings.py
    and ai/vectorstore.py exist. Once those are built, this becomes a
    normal top-of-file import.
    """
    from ai.embeddings import generate_embedding    # not yet implemented
    from ai.vectorstore import chromadb_collection  # not yet implemented

    query_vector = generate_embedding(request.specification)

    where_filter = {"department": request.domain} if request.domain else None

    top_matches = chromadb_collection.query(
        query_embeddings=[query_vector],
        n_results=3,
        where=where_filter
    )

    recommendations: list[StandardRecommendation] = []

    if top_matches["metadatas"] and top_matches["metadatas"][0]:
        metadatas = top_matches["metadatas"][0]
        distances = top_matches["distances"][0]  # lower distance = higher relevance

        for meta, distance in zip(metadatas, distances):
            score = max(0.0, 1.0 - distance)
            recommendations.append(
                StandardRecommendation(
                    is_number=meta.get("is_code", "Unknown IS"),
                    title=meta.get("title", "Unknown Title"),
                    category=meta.get("department", "Uncategorized"),
                    relevance_score=round(score, 2),
                    reason=f"Semantically matched user query with {score * 100:.1f}% confidence.",
                    status="Active",
                    related_standards=[]  # TODO: pull from StandardDependency table
                )
            )

    return RecommendationResponse(
        query=request.specification,
        recommendations=recommendations
    )


def recommend_standards(
    request: RecommendationRequest,
    db: Session | None = None
) -> RecommendationResponse:
    """Single entry point the route calls. Swaps to the rule-based
    fallback if the semantic path or its dependencies aren't ready."""

    if db is not None:
        try:
            return recommend_standards_semantic(request, db)
        except Exception:
            pass  # fall through to rule-based during early development

    return recommend_standards_rulebased(request)
