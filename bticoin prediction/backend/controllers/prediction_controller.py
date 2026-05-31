from services.data_service import DataService

class PredictionController:
    @staticmethod
    def get_prediction():
        """Controller logic for fetching the aggregated prediction."""
        return DataService.get_latest_prediction()
