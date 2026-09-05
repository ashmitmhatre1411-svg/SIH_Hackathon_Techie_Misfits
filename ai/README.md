# AI Module

## Purpose

The `ai` folder contains the Artificial Intelligence and semantic-search components of the project.

Its primary responsibility is to understand the meaning of a product description or technical specification and identify potentially relevant Indian Standards.

---

## Responsibilities

The AI layer handles:

* Text understanding
* Text embeddings
* Semantic similarity
* Vector search
* Candidate standard retrieval
* Ranking
* Confidence calculation
* Semantic fallback

---

## Architecture

```text
Product Specification
        |
        v
Text Normalization
        |
        v
Embedding Model
        |
        v
Vector Representation
        |
        v
ChromaDB / Vector Store
        |
        v
Similarity Search
        |
        v
Candidate Standards
        |
        v
Ranking
```

---

## Main Components

### `agent.py`

Contains the high-level AI agent/orchestration logic.

It coordinates:

```text
Input
 ↓
Understanding
 ↓
Retrieval
 ↓
Recommendation
```

---

### `config.py`

Contains configuration used by the AI layer.

Examples:

* Embedding model
* Vector database location
* Similarity threshold
* Retrieval count

Configuration should remain separate from application logic.

---

## `embeddings/`

Contains embedding-related implementation.

The embedding model converts text into numerical vectors.

Example:

```text
"PVC insulated copper cable for building wiring"
```

becomes a mathematical vector representing its semantic meaning.

This allows the system to identify relevant standards even when the exact IS number is not present in the input.

---

## `pipeline/`

Contains the AI processing pipeline.

Typical flow:

```text
Input
 ↓
Preprocessing
 ↓
Embedding
 ↓
Retrieval
 ↓
Ranking
 ↓
Recommendation
```

The pipeline should not directly contain frontend logic.

---

## `vectorstore/`

Contains vector database functionality.

ChromaDB can store embeddings of standards such as:

```text
IS Number
Title
Description
Category
Keywords
Certification Metadata
```

The vector store is responsible for retrieving semantically similar standards.

---

## Important Principle

The AI should NOT independently invent statutory requirements.

For example:

```text
AI:
"This product appears to match IS XXXX."

Database:
"IS XXXX has this version, amendment and certification metadata."

Application:
"Present the combined result."
```

This separation reduces hallucination risk.

---

## Adding a New Category

Adding a new category should primarily involve adding standards to the registry and vector store.

Example:

```text
Electrical
Plumbing
Lighting
        +
Construction
```

The AI pipeline should remain unchanged.

---

## Future Improvements

* Cross-encoder reranking
* Hybrid BM25 + vector retrieval
* Query expansion
* Multilingual embeddings
* Confidence calibration
* Evidence retrieval
* Duplicate standard detection
* Automated embedding refresh
