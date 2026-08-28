# Backend API Module (FastAPI)

This directory contains the core API server that handles frontend requests, validates data, and communicates with the database and AI services.

## Core Files (`app/core/` & `app/`)
* `main.py`: The entry point of the FastAPI application. It initializes the server and registers the API routers.
* `core/config.py`: Manages environment variables and application configurations (e.g., database URIs, API keys).

## API Routes (`app/api/routes/`)
* `health.py`: A simple `GET /api/health/` endpoint to verify the server is running.
* `recommendation.py`: The main `POST /api/recommend/` endpoint that receives user queries, calls the recommendation service, and returns structured data.

## Schemas (`app/schemas/`)
* `recommendation.py`: Contains Pydantic models (`RecommendationRequest`, `RecommendationResponse`) to strictly validate incoming user queries and format outgoing JSON responses.

## Business Logic (`app/services/`)
* `recommendation_service.py`: Currently contains placeholder/mock logic for string matching. Ultimately, this service will execute the ReAct agent, query the vector database, enforce the QCO gate, and return the synthesized LLM clause.
