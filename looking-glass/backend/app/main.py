from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import logging

# Import routers
from routers import timeline, probability, narratives, geospatial

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Project Looking Glass API",
    description="Predictive intelligence platform for analyzing global digital data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(timeline.router)
app.include_router(probability.router)
app.include_router(narratives.router)
app.include_router(geospatial.router)

@app.get("/")
async def root() -> Dict[str, Any]:
    """Root endpoint for API health check"""
    return {
        "status": "online",
        "service": "Looking Glass API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "components": {
            "api": "operational",
            "timeline": "operational",
            "probability": "operational",
            "narratives": "operational",
            "geospatial": "operational"
        }
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "status": "error",
        "code": exc.status_code,
        "message": exc.detail
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return {
        "status": "error",
        "code": 500,
        "message": "Internal server error"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
