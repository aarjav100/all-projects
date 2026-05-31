from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api import training, datasets

app = FastAPI(title="Smart Model Builder API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(training.router, prefix="/api", tags=["training"])
app.include_router(datasets.router, prefix="/api/datasets", tags=["datasets"])

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Model Builder API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
