"""Fast tests using fakes — no real model download, no real Chroma DB.
Run with: pytest ai/tests/test_pipeline.py"""

from ai.core.interfaces import EmbeddingModel, VectorStore
from ai.pipeline.rag_pipeline import StandardsRetriever


class FakeEmbedder(EmbeddingModel):
    def embed(self, text):
        return [1.0, 0.0]

    def embed_batch(self, texts):
        return [[1.0, 0.0] for _ in texts]


class FakeStore(VectorStore):
    def __init__(self):
        self.upserted = None

    def upsert(self, ids, embeddings, metadatas, documents):
        self.upserted = (ids, embeddings, metadatas, documents)

    def query(self, embedding, top_k, where=None):
        return [{"id": "IS 1:2020", "metadata": {"is_code": "IS 1:2020", "title": "Fake Standard"}, "distance": 0.1}]


def test_search_returns_expected_shape():
    retriever = StandardsRetriever(embedder=FakeEmbedder(), store=FakeStore())
    results = retriever.search("test query")
    assert results[0]["is_code"] == "IS 1:2020"
    assert 0.0 <= results[0]["score"] <= 1.0
