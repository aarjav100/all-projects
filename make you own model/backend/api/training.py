from fastapi import APIRouter, BackgroundTasks, HTTPException
from models.model_config import TrainRequest, TrainingStatus
from services.ml_service import ml_service
import uuid
import time

router = APIRouter()

# Mock storage for training status
training_jobs = {}

def train_model_task(job_id: str, request: TrainRequest):
    training_jobs[job_id] = {"status": "TRAINING", "progress": 0, "metrics": {}}
    
    try:
        # 1. Build model
        model = ml_service.build_keras_model(request.config.dict())
        training_jobs[job_id]["progress"] = 20
        
        # 2. Load and preprocess data (Mocking for now)
        # In real scenario, we would load the dataset using dataset_id
        time.sleep(2)
        training_jobs[job_id]["progress"] = 40
        
        # 3. Train
        # This is where we would call model.fit()
        # For MVP, we simulate training progress
        for i in range(1, 6):
            time.sleep(2)
            training_jobs[job_id]["progress"] = 40 + (i * 10)
            training_jobs[job_id]["metrics"] = {
                "accuracy": 0.5 + (i * 0.08),
                "loss": 0.5 - (i * 0.08)
            }
        
        # 4. Save and finish
        training_jobs[job_id]["status"] = "COMPLETED"
        training_jobs[job_id]["progress"] = 100
    except Exception as e:
        training_jobs[job_id]["status"] = "FAILED"
        training_jobs[job_id]["message"] = str(e)

@router.post("/train")
async def start_training(request: TrainRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(train_model_task, job_id, request)
    return {"job_id": job_id, "status": "PENDING"}

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return training_jobs[job_id]
