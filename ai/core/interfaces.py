"""Contracts every implementation must follow. The rest of the app —
tools.py, recommendation_service.py, agent.py — depends on THESE,
never on a concrete embedding model or vector DB directly. Swapping
sentence-transformers for OpenAI embeddings, or Chroma for Pinecone,
means writing one new class here and changing one line in config.py —
nothing else in the codebase moves."""

from abc import ABC, abstractmethod


class EmbeddingModel(ABC):
    @abstractmethod
    def embed(self, text: str) -> list[float]:
        ...

    @abstractmethod
    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        ...


class VectorStore(ABC):
    @abstractmethod
    def upsert(
        self,
        ids: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict],
        documents: list[str],
    ) -> None:
        ...

    @abstractmethod
    def query(
        self,
        embedding: list[float],
        top_k: int,
        where: dict | None = None,
    ) -> list[dict]:
        """Returns a list of {id, metadata, distance} dicts, already
        flattened — callers never see a specific vector DB's raw
        response shape (e.g. Chroma's nested lists-of-lists)."""
        ...
