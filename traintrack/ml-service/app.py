from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(title="Train Delay Prediction API")

# Load model and encoders
MODEL_PATH = "models/delay_model.joblib"
LE_STATION_PATH = "models/le_station.joblib"
LE_WEATHER_PATH = "models/le_weather.joblib"

class PredictionInput(BaseModel):
    train_number: str
    station_code: str
    day_of_week: int
    month: int
    is_holiday: int
    scheduled_arrival_hour: int
    weather: str

@app.get("/")
def read_root():
    return {"message": "Train Tracking ML Service is Online"}

@app.post("/predict-delay")
def predict_delay(data: PredictionInput):
    try:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(status_code=500, detail="Model not found. Please train the model first.")
            
        model = joblib.load(MODEL_PATH)
        le_station = joblib.load(LE_STATION_PATH)
        le_weather = joblib.load(LE_WEATHER_PATH)
        
        # Prepare input
        try:
            station_enc = le_station.transform([data.station_code])[0]
        except ValueError:
            # Handle unknown station
            station_enc = 0 
            
        try:
            weather_enc = le_weather.transform([data.weather])[0]
        except ValueError:
            # Handle unknown weather
            weather_enc = 0

        features = np.array([[
            data.day_of_week,
            data.month,
            data.is_holiday,
            data.scheduled_arrival_hour,
            station_enc,
            weather_enc
        ]])
        
        prediction = model.predict(features)[0]
        
        # Simulated confidence score based on R2 (hardcoded for demo)
        confidence_score = 0.85 
        late_probability = min(0.99, prediction / 120.0) if prediction > 0 else 0.05
        
        return {
            "predicted_delay_minutes": float(round(prediction, 1)),
            "confidence_score": confidence_score,
            "late_probability": float(round(late_probability, 2)),
            "model_version": "1.0.0"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
