"""One implementation of VectorStore. Nothing outside this file
knows or cares that it's Chroma under the hood — it always returns
plain flattened dicts via the VectorStore interface's query()."""

from ai.core.interfaces import VectorStore


class ChromaVectorStore(VectorStore):
    def __init__(self, collection_name: str = "indian_standards", path: str = "./.chroma"):
        import chromadb
        client = chromadb.PersistentClient(path=path)
        self._collection = client.get_or_create_collection(name=collection_name)

    def upsert(
        self,
        ids: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict],
        documents: list[str],
    ) -> None:
        self._collection.upsert(
            ids=ids, embeddings=embeddings, metadatas=metadatas, documents=documents
        )

    def query(
        self,
        embedding: list[float],
        top_k: int,
        where: dict | None = None,
    ) -> list[dict]:
        raw = self._collection.query(
            query_embeddings=[embedding], n_results=top_k, where=where
        )

        if not raw["metadatas"] or not raw["metadatas"][0]:
            return []

        return [
            {"id": id_, "metadata": meta, "distance": dist}
            for id_, meta, dist in zip(
                raw["ids"][0], raw["metadatas"][0], raw["distances"][0]
            )
        ]
