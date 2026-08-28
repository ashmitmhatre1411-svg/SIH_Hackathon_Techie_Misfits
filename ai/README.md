# AI & Search Module (Work in Progress)

This directory is responsible for the semantic understanding and generative drafting of tender clauses.

## Planned Implementation
* **Embeddings & Vector Store:** Scripts to convert database standard descriptions into vector embeddings using `sentence-transformers` and store them in ChromaDB.
* **ReAct Agent:** The LangChain/Python logic that routes user queries, searches the vector database, checks the SQLite QCO flags, and prompts the LLM (Groq/Llama or Gemini) to generate compliant text.
