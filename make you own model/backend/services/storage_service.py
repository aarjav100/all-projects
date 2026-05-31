import os
import shutil
from fastapi import UploadFile
from typing import List

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class StorageService:
    @staticmethod
    async def save_file(file: UploadFile, project_id: str) -> str:
        project_dir = os.path.join(UPLOAD_DIR, project_id)
        if not os.path.exists(project_dir):
            os.makedirs(project_dir)
            
        file_path = os.path.join(project_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return file_path

    @staticmethod
    def get_file_path(project_id: str, filename: str) -> str:
        return os.path.join(UPLOAD_DIR, project_id, filename)

storage_service = StorageService()
