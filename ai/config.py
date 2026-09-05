"""The ONE place that decides which concrete embedder and vector
store are in use. Every other file asks THIS module for a retriever
instead of importing SentenceTransformerEmbedder or ChromaVectorStore
directly. To switch models/stores later: change the two lines in
build_retriever() (or the env vars below) — nothing else changes."""

import os
from functools import lru_cache

from ai.embeddings.sentence_transformer_embedder import SentenceTransformerEmbedder
from ai.pipeline.rag_pipeline import StandardsRetriever
from ai.vectorstore.chroma_store import ChromaVectorStore

EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
VECTOR_COLLECTION_NAME = os.getenv("VECTOR_COLLECTION_NAME", "indian_standards")
VECTOR_STORE_PATH = os.getenv("VECTOR_STORE_PATH", "./.chroma")


@lru_cache(maxsize=1)
def get_retriever() -> StandardsRetriever:
    embedder = SentenceTransformerEmbedder(model_name=EMBEDDING_MODEL_NAME)
    store = ChromaVectorStore(collection_name=VECTOR_COLLECTION_NAME, path=VECTOR_STORE_PATH)
    return StandardsRetriever(embedder=embedder, store=store)
