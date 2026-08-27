from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, recommendation


app = FastAPI(
    title="Indian Standards Recommendation Engine",
    description="AI-powered recommendation engine for Indian Standards",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routes
# --------------------------------------------------

app.include_router(
    health.router,
    prefix="/api"
)

app.include_router(
    recommendation.router,
    prefix="/api"
)


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Indian Standards Recommendation Engine API",
        "status": "running"
    }