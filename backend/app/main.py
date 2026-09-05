from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import health, recommendation
from database.db import init_db

app = FastAPI(
    title="Indian Standards Recommendation Engine",
    description="Semantic Indian Standards, allied references and certification recommendation API",
    version="2.0.0",
)


@app.on_event("startup")
def on_startup():
    init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(recommendation.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Indian Standards Recommendation Engine API", "status": "running"}
