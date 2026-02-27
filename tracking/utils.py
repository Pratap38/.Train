# ##ek function create krna jisme agar data 10 min se upar not accept
# ##stale data logic
# from datetime import timedelta
# from django.utils import timezone



# STALE_WAIT = timedelta(minutes=10)
# AVG_SPEED_KMPH = 60  # conservative

# def is_cache_stale(last_updated):
#     if not last_updated:
#         return True
#     return timezone.now() - last_updated > STALE_WAIT


# def calculate_eta(distance_km):
#     if not distance_km:
#         return None
#     hours = distance_km / AVG_SPEED_KMPH
#     return int(hours * 60)


# def timeline(route, current_station_name):
#     completed = []
#     upcoming = []
#     current_found = False

#     for stop in route:
#         station_name = stop.station.name

#         if station_name == current_station_name:
#             completed.append(station_name)
#             current_found = True
#         elif not current_found:
#             completed.append(station_name)
#         else:
#             upcoming.append(station_name)

#     return {
#         "completed": completed,
#         "current": current_station_name,
#         "upcoming": upcoming
#     }


# ###low network area detection ke liye ab kam krte ham
# Low_network_km=15
# Avg_speed=60

# def detect_lowNetwork(route):
#     alerts = []

#     # safety: route kam se kam 2 stops ka hona chahiye
#     if not route or len(route) < 2:
#         return alerts

#     for i in range(len(route) - 1):
#         current = route[i]
#         next_stop = route[i + 1]

      
#         if not hasattr(current, "station") or not hasattr(next_stop, "station"):
#             continue

#         distanceKM = None

#         # distance calculation ke liye apan Math.abs use kar rhe so
#         if hasattr(current.station, "latitude") and hasattr(next_stop.station, "latitude"):
          
#             distanceKM = abs(current.stop_number - next_stop.stop_number) * 5

        
#         if distanceKM and distanceKM >= Low_network_km:

#             ## simple formula yaad hai na time nikalne ka distance/speed = time
#             distanceMin = int((distanceKM / AVG_SPEED_KMPH) * 60)

#             alerts.append({
#                 "from": current.station.name,
#                 "to": next_stop.station.name,
#                 "distance_km": distanceKM,
#                 "expected_duration_min": distanceMin,
#                 "severity": "HIGH" if distanceKM >= 30 else "MEDIUM"
#             })

#     return alerts

# ##Estimate time arrival calculation  

# def  travelTimeMIN(distanceKM):
#      if  not  distanceKM:
#           return 0
#      hrs=distanceKM/Avg_speed
#      return int(hrs*60)


# def propagate_delay(route,current_stopIndex,delayMin):
#      propagate=[]
#      for i in range(current_stopIndex,len(route)):
#          stop=route[i]
#          propagate.append({
#                 "station":stop.station.name,
#                 "Delay_min":delayMin
# })
#      return propagate

# ##final ETA calculator

# def ETACalculator(distanceKM,delayMin):
#     travelMin=travelTimeMIN(distanceKM)
#     return travelMin+delayMin

##fixex wala
    
from datetime import timedelta
from django.utils import timezone

STALE_WAIT = timedelta(minutes=10)
AVG_SPEED_KMPH = 60  # conservative
Avg_speed = 60
Low_network_km = 15


## ek function create krna jisme agar data 10 min se upar not accept
## stale data logic
def is_cache_stale(last_updated):
    if not last_updated:
        return True
    return timezone.now() - last_updated > STALE_WAIT


def calculate_eta(distance_km):
    if not distance_km:
        return None
    hours = distance_km / AVG_SPEED_KMPH
    return int(hours * 60)


def timeline(route, current_station_name):
    completed = []
    upcoming = []
    current_found = False

    for stop in route:
        station_name = stop.station.name

        if station_name == current_station_name:
            completed.append(station_name)
            current_found = True
        elif not current_found:
            completed.append(station_name)
        else:
            upcoming.append(station_name)

    return {
        "completed": completed,
        "current": current_station_name,
        "upcoming": upcoming
    }


### low network area detection ke liye ab kam krte ham
def detect_lowNetwork(route):
    alerts = []

    # safety: route kam se kam 2 stops ka hona chahiye
    if not route or len(route) < 2:
        return alerts

    for i in range(len(route) - 1):
        current = route[i]
        next_stop = route[i + 1]

        if not hasattr(current, "station") or not hasattr(next_stop, "station"):
            continue

        distanceKM = None

        # distance calculation ke liye apan Math.abs use kar rhe so
        if hasattr(current.station, "latitude") and hasattr(next_stop.station, "latitude"):
            distanceKM = abs(current.stop_number - next_stop.stop_number) * 5

        if distanceKM and distanceKM >= Low_network_km:

            ## simple formula yaad hai na time nikalne ka distance/speed = time
            distanceMin = int((distanceKM / AVG_SPEED_KMPH) * 60)

            alerts.append({
                "from": current.station.name,
                "to": next_stop.station.name,
                "distance_km": distanceKM,
                "expected_duration_min": distanceMin,
                "severity": "HIGH" if distanceKM >= 30 else "MEDIUM"
            })

    return alerts


## Estimate time arrival calculation
def travelTimeMIN(distanceKM):
    if not distanceKM:
        return 0
    hrs = distanceKM / Avg_speed
    return int(hrs * 60)


def propagate_delay(route, current_stopIndex, delayMin):
    propagate = []

    for i in range(current_stopIndex, len(route)):
        stop = route[i]
        propagate.append({
            "station": stop.station.name,
            "Delay_min": delayMin
        })

    return propagate


## final ETA calculator
def ETACalculator(distanceKM, delayMin):
    travelMin = travelTimeMIN(distanceKM)
    return travelMin + delayMin


##Building Map Route
## Building Map Route
def build_Map(route):
    points = []

    for stop in route:
        lat = getattr(stop.station, "latitude", None)
        lng = getattr(stop.station, "longitude", None)

        if lat is None or lng is None:
            continue   # safely skip if data not present

        points.append({
            "station": stop.station.name,
            "latitude": lat,
            "longitude": lng,
            "stop_number": stop.stop_number,
        })

    return points


## tracking train movement using interpolation
def positionTrack(start, end, progress):
    latitude = start["latitude"] + (end["latitude"] - start["latitude"]) * progress
    longitude = start["longitude"] + (end["longitude"] - start["longitude"]) * progress

    return {
        "latitude": round(latitude, 6),
        "longitude": round(longitude, 6)
    }


def calculate_progress(elapsed_min, eta_min):
    if not eta_min or eta_min <= 0:
        return 0
    return min(1, elapsed_min / eta_min)


## current train location
def getcurrentPosition(route_points, progress):
    if len(route_points) < 2:
        return None

    start = route_points[0]
    end = route_points[1]

    return positionTrack(start, end, progress)
