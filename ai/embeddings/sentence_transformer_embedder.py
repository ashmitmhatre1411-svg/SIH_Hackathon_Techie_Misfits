"""One implementation of EmbeddingModel. Nothing outside this file
knows or cares that it's sentence-transformers under the hood."""

from functools import lru_cache

from ai.core.interfaces import EmbeddingModel


class SentenceTransformerEmbedder(EmbeddingModel):
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name

    @property
    def _model(self):
        return _load_model(self.model_name)

    def embed(self, text: str) -> list[float]:
        return self._model.encode(text, show_progress_bar=False).tolist()

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return self._model.encode(texts, show_progress_bar=False).tolist()


@lru_cache(maxsize=4)
def _load_model(model_name: str):
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer(model_name)
