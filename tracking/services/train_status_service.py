from trains.models import Train
from tracking.models import Route, Traincache

from tracking.utils import (
    timeline,
    is_cache_stale,
    detect_lowNetwork,
    propagate_delay,
    ETACalculator,
    calculate_progress,
    build_Map,
    getcurrentPosition
)

from tracking.services.network_detect import (
    detect_low_network_ahead,
    timezoneEstimator,
    mergeRoutXone
)

from tracking.response import build_train_response


def get_train_status_data(train_number: str):

    # ---- TRAIN ----
    try:
        train = Train.objects.get(train_number=train_number)
    except Train.DoesNotExist:
        return {
            "success": False,
            "error": "Train not found"
        }

    # ---- ROUTE ----
    route = list(Route.objects.filter(train=train).order_by("stop_number"))
    if not route:
        return {
            "success": False,
            "error": "Route not found"
        }

    # ---- CURRENT + NEXT STOP ----
    current_index = 0
    current_stop = route[current_index]
    next_stop = route[current_index + 1] if len(route) > 1 else None

    # ---- DISTANCE ----
    distance_remaining = None
    if hasattr(train, "path") and train.path.distance_km:
        distance_remaining = train.path.distance_km / len(route)

    # ---- DELAY (SIMULATED) ----
    delay_min = 10

    # ---- MAP DATA ----
    route_points = build_Map(route)
    low_network_alerts = detect_low_network_ahead(route_points)
    zones = mergeRoutXone(route_points)

    # ---- ETA + PROGRESS ----
    eta_min = ETACalculator(distance_remaining, delay_min)
    elapsed_min = 5
    progress = calculate_progress(elapsed_min, eta_min)

    # ---- CURRENT POSITION ----
    current_position = getcurrentPosition(route_points, progress)

    # ---- TIME TO LOW NETWORK ZONES ----
    zone_predictions = timezoneEstimator(
        current_position,
        low_network_alerts,
        distance_remaining,
        eta_min
    )

    # ---- CACHE CHECK ----
    cache = getattr(train, "cache", None)

    if cache and not is_cache_stale(cache.last_updated):
        return build_train_response(
            train=train,
            current_station=cache.current_station_name,
            next_station=next_stop.station.name if next_stop else None,
            distance_remaining=distance_remaining,
            timeline=cache.journey_time,
            cached=True,
            eta_minutes=eta_min,
            delay_map=propagate_delay(route, current_index, delay_min),
            network_alerts=low_network_alerts,
            map_route=route_points,
            current_position=current_position,
            time_to_low_network=zone_predictions,
            low_network_zones=zones
        )

    # ---- CACHE MISS ----
    timeline_data = timeline(route, current_stop.station.name)

    Traincache.objects.update_or_create(
        train=train,
        defaults={
            "current_station_name": current_stop.station.name,
            "journey_time": timeline_data
        }
    )

    return build_train_response(
        train=train,
        current_station=current_stop.station.name,
        next_station=next_stop.station.name if next_stop else None,
        distance_remaining=distance_remaining,
        timeline=timeline_data,
        cached=False,
        eta_minutes=eta_min,
        delay_map=propagate_delay(route, current_index, delay_min),
        network_alerts=detect_lowNetwork(route),
        map_route=route_points,
        current_position=current_position,
        time_to_low_network=zone_predictions,
        low_network_zones=zones
    )
