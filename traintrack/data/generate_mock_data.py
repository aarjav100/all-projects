import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Constants
NUM_RECORDS = 5000
TRAINS = [f"1200{i}" for i in range(1, 11)]
STATIONS = ["NDLS", "CNB", "LKO", "BSB", "DDU", "PNBE", "HWH"]
WEATHER_CONDITIONS = ["Clear", "Rainy", "Foggy", "Stormy"]

def generate_data():
    data = []
    start_date = datetime(2024, 1, 1)
    
    for i in range(NUM_RECORDS):
        train_no = random.choice(TRAINS)
        station = random.choice(STATIONS)
        date = start_date + timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))
        
        day_of_week = date.weekday() # 0-6
        month = date.month
        is_holiday = 1 if random.random() < 0.1 else 0
        weather = random.choice(WEATHER_CONDITIONS)
        
        # Base delay logic
        base_delay = random.randint(0, 30)
        
        # Add delay modifiers
        if weather == "Foggy": base_delay += random.randint(30, 120)
        if weather == "Rainy": base_delay += random.randint(10, 40)
        if is_holiday: base_delay += random.randint(15, 60)
        if day_of_week >= 5: base_delay += random.randint(10, 30) # Weekend rush
        
        # Add some randomness
        delay_minutes = max(0, base_delay + random.randint(-15, 15))
        
        data.append({
            "train_number": train_no,
            "station_code": station,
            "day_of_week": day_of_week,
            "month": month,
            "is_holiday": is_holiday,
            "weather": weather,
            "scheduled_arrival_hour": date.hour,
            "delay_minutes": delay_minutes
        })
        
    df = pd.DataFrame(data)
    df.to_csv("f:/projects/traintrack/data/historical_delays.csv", index=False)
    print(f"Generated {NUM_RECORDS} records in data/historical_delays.csv")

if __name__ == "__main__":
    generate_data()
