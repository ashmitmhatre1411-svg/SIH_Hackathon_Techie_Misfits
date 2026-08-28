# SIH Hackathon: Procurement RAG Assistant (Techie Misfits)

This project is a domain-aware Retrieval-Augmented Generation (RAG) assistant designed to translate plain-language procurement queries into legally binding, standard-compliant tender clauses. It helps procurement officers avoid disciplinary action by automatically enforcing mandatory Quality Control Orders (QCOs) and Bureau of Indian Standards (BIS) codes.

## Project Structure
* `backend/`: Contains the FastAPI server, routing logic, and Pydantic schemas.
* `database/`: Contains SQLAlchemy database models and seeding scripts.
* `ai/`: Placeholder for Vector Search (ChromaDB), Embeddings, and the ReAct Agent logic.
* `frontend/`: Placeholder for the UI (Streamlit/React).

## Current Status
* **Completed:** FastAPI foundation, Pydantic data validation, SQLAlchemy relational database models (Tier 1/2/3 tracking), and a deterministic database seeding script.
* **Pending:** Semantic vector search (ChromaDB integration), ReAct LLM Agent routing, and Frontend UI integration.
