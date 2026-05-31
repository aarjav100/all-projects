from fastapi import APIRouter
from controllers.prediction_controller import PredictionController

router = APIRouter()

@router.get("/prediction")
def get_prediction():
    """Endpoint for returning the aggregated live prediction model output."""
    return PredictionController.get_prediction()
