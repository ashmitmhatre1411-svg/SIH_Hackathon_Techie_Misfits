from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ...schemas.recommendation import RecommendationRequest, RecommendationResponse
from ...services.document_service import extract_text
from ...services.recommendation_service import recommend_standards
from database.db import get_db

router = APIRouter(prefix="/recommend", tags=["Recommendations"])


@router.post("/", response_model=RecommendationResponse)
def get_recommendations(request: RecommendationRequest, db: Session = Depends(get_db)):
    return recommend_standards(request, db)


@router.post("/analyze", response_model=RecommendationResponse)
async def analyze_input(
    specification: str | None = Form(default=None),
    domain: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    text = (specification or "").strip()
    input_type = "text"

    if file is not None:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file has no filename.")
        data = await file.read()
        if len(data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File is larger than 10 MB.")
        try:
            extracted = extract_text(file.filename, data).strip()
        except ValueError as exc:
            raise HTTPException(status_code=415, detail=str(exc)) from exc
        text = f"{text}\n{extracted}".strip()
        input_type = "document"

    if len(text) < 3:
        raise HTTPException(status_code=422, detail="Provide a product description/specification or upload a document.")

    result = recommend_standards(
        RecommendationRequest(specification=text, domain=domain),
        db,
    )
    result.input_type = input_type
    return result
