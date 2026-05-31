import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Paths
DATA_PATH = "../data/historical_delays.csv"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "delay_model.joblib")
LE_STATION_PATH = os.path.join(MODEL_DIR, "le_station.joblib")
LE_WEATHER_PATH = os.path.join(MODEL_DIR, "le_weather.joblib")

def train():
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
    print(f"Loading data from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    # Feature Engineering
    # Encoding categorical variables
    le_station = LabelEncoder()
    df['station_code_enc'] = le_station.fit_transform(df['station_code'])
    
    le_weather = LabelEncoder()
    df['weather_enc'] = le_weather.fit_transform(df['weather'])
    
    # Features and Target
    features = ['day_of_week', 'month', 'is_holiday', 'scheduled_arrival_hour', 'station_code_enc', 'weather_enc']
    X = df[features]
    y = df['delay_minutes']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Model - Random Forest
    print("Training Random Forest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluation
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)
    
    print(f"Model Evaluation:")
    print(f"MAE: {mae:.2f} mins")
    print(f"RMSE: {rmse:.2f} mins")
    print(f"R2 Score: {r2:.2f}")
    
    # Save Model and Encoders
    joblib.dump(model, MODEL_PATH)
    joblib.dump(le_station, LE_STATION_PATH)
    joblib.dump(le_weather, LE_WEATHER_PATH)
    print(f"Model and encoders saved in {MODEL_DIR}")

if __name__ == "__main__":
    train()
