# SIH implementation pack — Standards Recommendation

## What this version implements

1. Text input: product description / technical specification / tender text.
2. PDF, DOCX, TXT, MD and CSV upload with server-side text extraction.
3. Semantic retrieval through the existing SentenceTransformer + Chroma abstraction.
4. Deterministic fallback when vector dependencies are unavailable.
5. Primary standard + allied standards.
6. Allied relationship types: normative reference, test method, material, allied product.
7. Current-version/revision/amendment/review/reaffirmation metadata.
8. Certification metadata: BIS Product Certification, CRS, QCO/order and mandatory flag.
9. Generated tender clause that explicitly tells the user to verify current official status.
10. Three demo categories: Electrical, Plumbing, Lighting.

## Run from repository root

```text
pip install -r Requirements.txt
python -m database.SeedScript
uvicorn backend.app.main:app --reload
```

Frontend:

```text
cd frontend/project_frontend
npm install
npm run dev
```

If the backend is not on `http://127.0.0.1:8000`, set:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Important

The database is a curated hackathon catalogue. It is NOT a legal substitute for checking the current BIS standard page/QCO notification before tender issuance. The data model intentionally stores `source_url` and `verified_on` so a future BIS synchronisation job can replace the demo catalogue without changing the recommendation API.

## Existing project files replaced

- `database/models.py`
- `database/SeedScript.py`
- `backend/app/schemas/recommendation.py`
- `backend/app/services/document_service.py`
- `backend/app/services/recommendation_service.py`
- `backend/app/api/routes/recommendation.py`
- `backend/app/main.py`
- `Requirements.txt`
- `frontend/project_frontend/src/App.tsx`
- `frontend/project_frontend/src/index.css`
