from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.storage_service import storage_service
import pandas as pd
import os
import zipfile
import json

router = APIRouter()

@router.post("/upload")
async def upload_dataset(
    project_id: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        file_path = await storage_service.save_file(file, project_id)
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        metadata = {
            "filename": file.filename,
            "path": file_path,
            "size": os.path.getsize(file_path),
            "type": file_extension[1:].upper()
        }
        
        # Simple validation/metadata extraction
        if file_extension == ".csv":
            df = pd.read_csv(file_path, nrows=5)
            metadata["columns"] = df.columns.tolist()
            metadata["sample"] = df.to_dict(orient="records")
        elif file_extension == ".zip":
            # For images, count files in zip
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                metadata["image_count"] = len([f for f in zip_ref.namelist() if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
        
        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
