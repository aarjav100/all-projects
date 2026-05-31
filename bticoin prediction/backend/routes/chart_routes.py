from fastapi import APIRouter
from controllers.chart_controller import ChartController

router = APIRouter()

@router.get("/chart-data")
def get_chart_data():
    """Endpoint for rendering the prediction visual chart data."""
    return ChartController.get_chart_data()
