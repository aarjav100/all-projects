import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import traceback
import logging

from config import get_settings
from routes import upload, jobs, convert, edit, templates as templates_router
from storage import get_file_path

settings = get_settings()
print(f"DEBUG: origins_list={settings.origins_list}")

app = FastAPI(
    title="PDF Studio API",
    description="Full-stack PDF processing, AI summary, conversion, and editing",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler to ensure CORS headers on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Global exception: {str(exc)}")
    logging.error(traceback.format_exc())
    
    # Create the response
    response = JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )
    
    # Manually add CORS headers
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
    else:
        # Fallback for safety
        response.headers["Access-Control-Allow-Origin"] = "*"
        
    return response

# Routers
app.include_router(upload.router, tags=["Upload"])
app.include_router(jobs.router, tags=["Jobs"])
app.include_router(convert.router, tags=["Convert"])
app.include_router(edit.router, tags=["Edit"])
app.include_router(templates_router.router, tags=["Templates"])


# File serving endpoint
@app.get("/files/{filename}")
async def serve_file(filename: str):
    path = get_file_path(filename)
    if path is None:
        return JSONResponse({"error": "File not found or expired"}, status_code=404)
    return FileResponse(path, filename=filename)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
