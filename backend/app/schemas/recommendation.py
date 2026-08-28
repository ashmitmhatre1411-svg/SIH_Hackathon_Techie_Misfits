from app.schemas.recommendation import RecommendationResponse, StandardRecommendation
from sqlalchemy.orm import Session

def get_recommendations(query: str, db: Session):
    # 1. Convert user query to vector
    query_vector = generate_embedding(query) 
    
    # 2. ChromaDB search
    top_matches = chromadb_collection.query(
        query_embeddings=[query_vector], 
        n_results=3
    )
    
    # 3. Format the results into Pydantic models
    recommendations_list = []
    
    # ChromaDB returns lists of lists. We access the first index [0] for our single query.
    if top_matches["metadatas"] and top_matches["metadatas"][0]:
        metadatas = top_matches["metadatas"][0]
        distances = top_matches["distances"][0] # Lower distance = higher relevance
        
        for i in range(len(metadatas)):
            meta = metadatas[i]
            
            # Convert ChromaDB's distance metric to a 0-1 relevance score
            score = max(0.0, 1.0 - distances[i])
            
            # Map the vector metadata to your Pydantic model
            rec = StandardRecommendation(
                is_number=meta.get("is_code", "Unknown IS"), # Extracted from Chroma metadata
                title=meta.get("title", "Unknown Title"),
                category=meta.get("department", "Uncategorized"),
                relevance_score=round(score, 2), # Validates against your ge=0, le=1 rule
                reason=f"Semantically matched user query with {score*100:.1f}% confidence.",
                status="Active", 
                related_standards=[] # This can be fetched from the DB relationships later
            )
            recommendations_list.append(rec)
            
    # 4. Return the final validated schema back to the FastAPI router
    return RecommendationResponse(
        query=query,
        recommendations=recommendations_list
    )
