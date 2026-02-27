from trains.models import Train
from tracking.services.train_status_service import get_train_status_data
from rest_framework.test import APIRequestFactory

def handler(train_number:str):
    data = get_train_status_data(train_number)

    if not data:
        return {
            "success": False,
            "error": "Train not found"
        }

    return data
