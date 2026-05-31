import os
import random
import pandas as pd
from datetime import datetime, timedelta

DATA_FILE = '../bitcoin_automl_image_tableau.csv'

class DataService:
    @staticmethod
    def get_latest_prediction():
        """Reads the latest prediction from CSV or falls back to mock data."""
        if os.path.exists(DATA_FILE):
            try:
                df = pd.read_csv(DATA_FILE)
                last_row = df.iloc[-1]
                return {
                    "current_close": float(last_row['Close']),
                    "predicted_close": float(last_row['Predicted_Close']),
                    "min_band": float(last_row['Lower_Bound']),
                    "max_band": float(last_row['Upper_Bound']),
                    "tabular_signal": last_row['Signal'],
                    "cnn_pattern": last_row['CNN_Pattern'].replace('_', ' ').capitalize(),
                    "cnn_confidence": float(last_row['CNN_Confidence']) * 100,
                    "combined_signal": "BUY" if last_row['Signal'] == 'BUY' else "SELL"
                }
            except Exception as e:
                print(f"Error reading CSV: {e}")
        
        # Fallback to realistic mock if CSV not ready
        return {
            "current_close": 64250.00,
            "predicted_close": 64950.00,
            "min_band": 63100.00,
            "max_band": 65800.00,
            "tabular_signal": "BUY",
            "cnn_pattern": "bull_flag",
            "cnn_confidence": 91.2,
            "combined_signal": "STRONG BUY"
        }

    @staticmethod
    def get_chart_data():
        """Returns the chart mapping for predictions."""
        data = []
        current_price = 61000
        predicted_price = 61000
        
        if os.path.exists(DATA_FILE):
            try:
                df = pd.read_csv(DATA_FILE)
                recent = df.tail(30).reset_index(drop=True)
                for i, row in recent.iterrows():
                    try:
                        dt = datetime.strptime(str(row['Date']), '%Y-%m-%d')
                        date_str = dt.strftime("%b %d")
                    except:
                        date_str = str(row['Date'])
                    
                    if i >= 25:
                        data.append({
                            "name": date_str,
                            "predicted": float(row['Predicted_Close']),
                            "isFuture": True
                        })
                    else:
                        data.append({
                            "name": date_str,
                            "real": float(row['Close']),
                            "predicted": float(row['Predicted_Close'])
                        })
                return data
            except Exception as e:
                 print(f"Error reading CSV for chart: {e}")

        # Fallback chart data
        for i in range(30):
            time = datetime.now() - timedelta(days=30 - i)
            current_price += (random.random() - 0.45) * 1500
            predicted_price = current_price + (random.random() - 0.4) * 1800
            if i >= 25:
                data.append({
                    "name": time.strftime("%b %d"),
                    "predicted": predicted_price,
                    "isFuture": True
                })
            else:
                data.append({
                    "name": time.strftime("%b %d"),
                    "real": current_price,
                    "predicted": predicted_price
                })
        return data
