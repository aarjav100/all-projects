from services.data_service import DataService

class ChartController:
    @staticmethod
    def get_chart_data():
        """Controller logic for fetching historical and predicted chart series."""
        return DataService.get_chart_data()
