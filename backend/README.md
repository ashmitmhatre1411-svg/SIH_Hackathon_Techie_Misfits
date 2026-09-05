# Backend

## Purpose

The `backend` folder contains the FastAPI application responsible for connecting the frontend, AI services, document processing, and database.

---

## Responsibilities

The backend handles:

* API requests
* Input validation
* File uploads
* Document extraction
* Recommendation orchestration
* AI service integration
* Database integration
* JSON response generation

---

## Architecture

```text
Frontend
   |
   | HTTP
   v
FastAPI
   |
   +----------------+
   |                |
   v                v
Document        Recommendation
Service          Service
   |                |
   v                v
PDF/DOCX        AI + Database
Extraction
   |                |
   +-------+--------+
           |
           v
       API Response
```

---

## Folder Structure

```text
backend/
│
├── README.md
│
└── app/
    ├── main.py
    │
    ├── api/
    │   └── routes/
    │       └── recommendation.py
    │
    ├── schemas/
    │   └── recommendation.py
    │
    └── services/
        ├── document_service.py
        └── recommendation_service.py
```

---

## `app/main.py`

Main FastAPI application.

Responsibilities:

* Create FastAPI application
* Register API routes
* Configure CORS
* Provide health endpoint
* Start application

---

## `api/routes/`

Contains API endpoints.

### Recommendation Endpoint

```text
POST /api/recommend/analyze
```

The endpoint accepts:

```text
specification
domain
file
```

---

## `schemas/`

Contains Pydantic request/response models.

Schemas provide:

* Input validation
* Type safety
* Consistent API responses
* Documentation in Swagger

---

## `services/`

Contains business logic.

### `document_service.py`

Responsible for extracting text from:

```text
PDF
DOCX
TXT
MD
CSV
```

The extracted text is passed to the recommendation service.

---

### `recommendation_service.py`

The main recommendation orchestration layer.

It combines:

```text
User Input
    ↓
Semantic Retrieval
    ↓
Database Metadata
    ↓
Allied Standards
    ↓
Certification
    ↓
Final Recommendation
```

---

## Example API Request

```text
Product:
"1100V PVC insulated copper cable suitable for building wiring"
```

The backend may return:

```json
{
  "primary_standard": {
    "is_number": "IS 694:2010"
  },
  "allied_standards": [],
  "certification": {},
  "confidence": 0.91
}
```

---

## Error Handling

The backend should gracefully handle:

* Missing specification
* Invalid file
* Unsupported file type
* Empty document
* AI service failure
* Database failure
* Low-confidence recommendation

The system should return meaningful HTTP errors instead of crashing.

---

## Security Considerations

Future production deployment should include:

* File-size limits
* File-type validation
* Malware scanning
* Authentication
* Rate limiting
* Input sanitization
* Audit logging

---

## Running

From the project root:

```bash
pip install -r Requirements.txt
```

Then:

```bash
uvicorn backend.app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```
