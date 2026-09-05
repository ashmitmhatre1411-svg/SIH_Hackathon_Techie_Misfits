"""Orchestrates retrieval. Depends only on the interfaces, not on
sentence-transformers or Chroma by name — those are injected in.
This is the ONE class tools.py and recommendation_service.py talk to."""

from sqlalchemy.orm import Session

from ai.core.interfaces import EmbeddingModel, VectorStore
from database.models import IndianStandard


class StandardsRetriever:
    def __init__(self, embedder: EmbeddingModel, store: VectorStore):
        self.embedder = embedder
        self.store = store

    def ingest(self, db: Session) -> int:
        standards = db.query(IndianStandard).all()
        if not standards:
            return 0

        texts = [f"{s.title}. {s.description or ''}" for s in standards]
        embeddings = self.embedder.embed_batch(texts)

        self.store.upsert(
            ids=[s.is_code for s in standards],
            embeddings=embeddings,
            metadatas=[
                {
                    "is_code": s.is_code,
                    "title": s.title,
                    "department": s.department or "Uncategorized",
                    "is_qco_mandatory": bool(s.is_qco_mandatory),
                }
                for s in standards
            ],
            documents=texts,
        )
        return len(standards)

    def search(self, query: str, top_k: int = 3, domain: str | None = None) -> list[dict]:
        where = {"department": domain} if domain else None
        embedding = self.embedder.embed(query)
        hits = self.store.query(embedding, top_k=top_k, where=where)

        return [
            {**hit["metadata"], "score": round(max(0.0, 1.0 - hit["distance"]), 2)}
            for hit in hits
        ]
