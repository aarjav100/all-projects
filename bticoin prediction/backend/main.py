from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import prediction_routes, chart_routes

app = FastAPI(
    title="Bitcoin AutoML Prediction API",
    description="Backend API connecting Python Data Science output to the React Frontend",
    version="1.0.0"
)

# Allow frontend to access the API seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register specialized modular routes
app.include_router(prediction_routes.router, prefix="/api", tags=["Predictions"])
app.include_router(chart_routes.router, prefix="/api", tags=["Charts"])

@app.get("/")
def health_check():
    """Health status and general data server info."""
    return {"status": "ok", "service": "Bitcoin Prediction Analytics API"}
