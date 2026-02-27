from django.utils import timezone

def build_train_response(
    train,
    current_station,
    next_station,
    distance_remaining,
    timeline,
    cached,
    eta_minutes,
    delay_map,
    network_alerts,
    map_route,
    current_position,
    time_to_low_network=None,
    low_network_zones=None   # ✅ supported
):
    response = {
        "success": True,
        "data": {
            "train_number": train.train_number,
            "train_name": train.name,
            "current_station": current_station,
            "next_station": next_station,
            "distance_remaining_km": distance_remaining,
            "eta_minutes": eta_minutes,
            "journey_timeline": timeline,
            "delay_map": delay_map,
            "network_alerts": network_alerts,
            "time_to_low_network": time_to_low_network,
            "map_route": map_route,
            "current_position": current_position,
            "cached": cached,
            "last_updated": timezone.now()
        }
    }

    # 🔧 MINIMAL ADDITION
    if low_network_zones is not None:
        response["data"]["low_network_zones"] = low_network_zones

    return response
