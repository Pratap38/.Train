# import csv
# from math import sqrt


# # In-memory store (loaded once, reused everywhere)
# NETWORK_POINTS = []


# # -----------------------------
# # CSV LOADER
# # -----------------------------
# def load_network_csv(csv_path):
#     """
#     Loads mobile network tower data from CSV into memory.
#     Called once at startup.
#     """
#     global NETWORK_POINTS

#     with open(csv_path, newline="", encoding="utf-8") as f:
#         reader = csv.DictReader(f)

#         for row in reader:
#             if not row.get("lat") or not row.get("long"):
#                 continue

#             try:
#                 NETWORK_POINTS.append({
#                     "lat": float(row["lat"]),
#                     "lon": float(row["long"]),
#                     "range": float(row.get("range", 1000)),      # meters
#                     "signal": int(row.get("avgsignal", 0))       # signal strength
#                 })
#             except ValueError:
#                 continue


# def load_all_network_data():
#     """
#     Load all telecom datasets (404 / 405).
#     Call this ONCE when server starts.
#     """
#     load_network_csv("tracking/data/network/404.csv")
#     load_network_csv("tracking/data/network/405.csv")


# # -----------------------------
# # DISTANCE HELPER
# # -----------------------------
# def _distance_km(lat1, lon1, lat2, lon2):
#     """
#     Fast geographic distance approximation.
#     Accurate enough for telecom zones.
#     """
#     return sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) * 111


# # -----------------------------
# # LOW NETWORK DETECTOR (USP)
# # -----------------------------
# def is_low_network_zone(train_lat, train_lon, signal_threshold=2):
#     """
#     Returns True if train is currently inside a weak network area.
#     """

#     if not NETWORK_POINTS:
#         return False

#     for tower in NETWORK_POINTS:
#         dist_km = _distance_km(
#             train_lat,
#             train_lon,
#             tower["lat"],
#             tower["lon"]
#         )

#         # convert km → meters
#         if dist_km * 1000 <= tower["range"]:
#             if tower["signal"] <= signal_threshold:
#                 return True

#     return False


# # -----------------------------
# # ALERT BUILDER (API-FRIENDLY)
# # -----------------------------
# def get_low_network_alert(train_lat, train_lon):
#     """
#     Returns structured alert for API response.
#     """

#     if is_low_network_zone(train_lat, train_lon):
#         return {
#             "low_network": True,
#             "severity": "HIGH",
#             "reason": "Weak mobile coverage zone detected"
#         }

#     return {
#         "low_network": False
#     }

# import csv
# import math
# from math import radians, sin, cos, sqrt, atan2
# import csv


# NETWORK_POINTS = []
# NETWORK_CACHE = {}   # train_number → alerts

# EARTH_RADIUS_M = 6371000  # meters

# # ---------- LOAD DATASET ----------
# def load_network_csv(csv_path):
#     global NETWORK_POINTS

#     with open(csv_path, newline='', encoding='utf-8') as f:
#         reader = csv.DictReader(f)

#         for row in reader:
#             if not row.get("lat") or not row.get("long"):
#                 continue

#             try:
#                 NETWORK_POINTS.append({
#                     "lat": float(row["lat"]),
#                     "lon": float(row["long"]),
#                     "signal": int(row.get("avgsignal", -120)),
#                     "range": float(row.get("range", 1000)),
#                     "radio": row.get("radio")
#                 })
#             except ValueError:
#                 continue


# # ---------- DISTANCE ----------
# def _distance_m(lat1, lon1, lat2, lon2):
#     return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2) * 111_000


# # ---------- SEVERITY ----------
# def _signal_severity(signal):
#     if signal < -110:
#         return "CRITICAL"
#     elif signal < -95:
#         return "HIGH"
#     elif signal < -85:
#         return "MEDIUM"
#     return None


# # ---------- POINT CHECK ----------
# def is_low_network_zone(lat, lon):
#     min_distance = None
#     nearest_radio = None

#     for p in NETWORK_POINTS:

#         # ⛔ coarse spatial filter (still valid)
#         if abs(p["lat"] - lat) > 0.2 or abs(p["lon"] - lon) > 0.2:
#             continue

#         d = haversine_m(lat, lon, p["lat"], p["lon"])

#         if min_distance is None or d < min_distance:
#             min_distance = d
#             nearest_radio = p.get("radio")

#         # early exit → strong coverage
#         if d < 500:
#             return None

#     if min_distance is None:
#         return None

#     if min_distance > 8000:
#         severity = "CRITICAL"
#     elif min_distance > 4000:
#         severity = "HIGH"
#     elif min_distance > 1500:
#         severity = "MEDIUM"
#     else:
#         return None

#     return {
#         "low_network": True,
#         "severity": severity,
#         "coverage_gap_m": int(min_distance),
#         "radio": nearest_radio
#     }



# # ---------- ROUTE-AWARE DETECTION ----------
# def detect_low_network_along_route(train_number, route_points):
#     """
#     Detect low network ahead of train
#     Cached per train
#     """

#     if train_number in NETWORK_CACHE:
#         return NETWORK_CACHE[train_number]

#     alerts = []

#     for point in route_points:
#         result = is_low_network_zone(point["latitude"], point["longitude"])

#         if result:
#             alerts.append({
#                 "station": point["station"],
#                 "latitude": point["latitude"],
#                 "longitude": point["longitude"],
#                 "severity": result["severity"],
#                 "signal": result["signal"]
#             })

#     NETWORK_CACHE[train_number] = alerts
#     return alerts
# def detect_low_network_ahead(map_route):
#     alerts = []

#     for point in map_route:
#         # ❌ skip invalid GPS points
#         if point["latitude"] == 0.0 and point["longitude"] == 0.0:
#             continue

#         zone = is_low_network_zone(
#             point["latitude"],
#             point["longitude"]
#         )

#         if zone:
#             alerts.append({
#                 "station": point["station"],
#                "latitude": point["latitude"],     # ✅ ADD
#                 "longitude": point["longitude"],   # ✅ ADD
#                 **zone
#             })

#     return alerts

# ## calculation of time zone calculation karenge kitna der rhega low network zone
# def timezoneEstimator(
#     current_position,
#     low_network_alerts,
#     distanceKM,
#     eta_min
# ):
#     # 🛑 HARD GUARDS (PREVENT CRASHES)
#     if (
#         not isinstance(current_position, dict)
#         or "latitude" not in current_position
#         or "longitude" not in current_position
#         or not isinstance(low_network_alerts, list)
#         or not distanceKM
#         or not eta_min
#         or eta_min <= 0
#     ):
#         return []

#     speed_km_per_min = distanceKM / eta_min
#     predictions = []

#     for alert in low_network_alerts:
#         if "latitude" not in alert or "longitude" not in alert:
#             continue

#         # distance_km = math.sqrt(
#         #     (current_position["latitude"] - alert["latitude"]) ** 2 +
#         #     (current_position["longitude"] - alert["longitude"]) ** 2
#         # ) * 111

#         # time_to_zone = distance_km / speed_km_per_min

#         # duration = None
#         # if alert.get("coverage_gap_m"):
#         #     duration = (alert["coverage_gap_m"] / 1000) / speed_km_per_min

#         # predictions.append({
#         #     "station": alert.get("station"),
#         #     "severity": alert.get("severity"),
#         #     "time_to_zone_min": round(time_to_zone, 1),
#         #     "expected_duration_min": round(duration, 1) if duration else None
#         # })
#         distance_m = haversine_m(
#     current_position["latitude"],
#     current_position["longitude"],
#     alert["latitude"],
#     alert["longitude"]
# )

#     distance_km = distance_m / 1000


#     return predictions
# # calculation of zone merge

# def haversine_m(lat1, lon1, lat2, lon2):
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

#     dlat = lat2 - lat1
#     dlon = lon2 - lon1

#     a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
#     c = 2 * atan2(sqrt(a), sqrt(1 - a))

#     return EARTH_RADIUS_M * c

import csv
from math import radians, sin, cos, sqrt, atan2

NETWORK_POINTS = []
NETWORK_CACHE = {}

EARTH_RADIUS_M = 6371000  # meters


# ---------- HAVERSINE DISTANCE ----------
def haversine_m(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return EARTH_RADIUS_M * c


# ---------- LOAD DATASET ----------
def load_network_csv(csv_path):
    global NETWORK_POINTS

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get("lat") or not row.get("long"):
                continue
            try:
                NETWORK_POINTS.append({
                    "lat": float(row["lat"]),
                    "lon": float(row["long"]),
                    "signal": int(row.get("avgsignal", -120)),
                    "range": float(row.get("range", 1000)),
                    "radio": row.get("radio")
                })
            except ValueError:
                continue


# ---------- SEVERITY ----------
def _signal_severity(signal):
    if signal < -110:
        return "CRITICAL"
    elif signal < -95:
        return "HIGH"
    elif signal < -85:
        return "MEDIUM"
    return None


# ---------- POINT CHECK ----------
def is_low_network_zone(lat, lon):
    min_distance = None
    nearest_radio = None

    for p in NETWORK_POINTS:

        # coarse spatial filter
        if abs(p["lat"] - lat) > 0.2 or abs(p["lon"] - lon) > 0.2:
            continue

        d = haversine_m(lat, lon, p["lat"], p["lon"])

        if min_distance is None or d < min_distance:
            min_distance = d
            nearest_radio = p.get("radio")

        if d < 500:
            return None

    if min_distance is None:
        return None

    if min_distance > 8000:
        severity = "CRITICAL"
    elif min_distance > 4000:
        severity = "HIGH"
    elif min_distance > 1500:
        severity = "MEDIUM"
    else:
        return None

    return {
        "low_network": True,
        "severity": severity,
        "coverage_gap_m": int(min_distance),
        "radio": nearest_radio
    }


# ---------- ROUTE AHEAD ----------
def detect_low_network_ahead(map_route):
    alerts = []

    for point in map_route:
        if point["latitude"] == 0.0 and point["longitude"] == 0.0:
            continue

        zone = is_low_network_zone(point["latitude"], point["longitude"])
        if zone:
            alerts.append({
                "station": point["station"],
                "latitude": point["latitude"],
                "longitude": point["longitude"],
                **zone
            })

    return alerts


# ---------- TIME TO ZONE ----------
def timezoneEstimator(current_position, low_network_alerts, distanceKM, eta_min):

    if (
        not isinstance(current_position, dict)
        or "latitude" not in current_position
        or "longitude" not in current_position
        or not isinstance(low_network_alerts, list)
        or not distanceKM
        or not eta_min
        or eta_min <= 0
    ):
        return []

    speed_km_per_min = distanceKM / eta_min
    predictions = []

    for alert in low_network_alerts:
        if "latitude" not in alert or "longitude" not in alert:
            continue

        distance_m = haversine_m(
            current_position["latitude"],
            current_position["longitude"],
            alert["latitude"],
            alert["longitude"]
        )

        distance_km = distance_m / 1000
        time_to_zone = distance_km / speed_km_per_min

        duration = None
        if alert.get("coverage_gap_m"):
            duration = (alert["coverage_gap_m"] / 1000) / speed_km_per_min

        predictions.append({
            "station": alert.get("station"),
            "severity": alert.get("severity"),
            "time_to_zone_min": round(time_to_zone, 1),
            "expected_duration_min": round(duration, 1) if duration else None
        })

    return predictions
MAX_ZONE_GAP_M = 7000  # 7 km tolerance

SEVERITY_ORDER = {
    "MEDIUM": 1,
    "HIGH": 2,
    "CRITICAL": 3
}

def mergeRoutXone(map_route):
    zones = []
    current_zone = None
    last_alert_point = None

    for point in map_route:

        # skip invalid coordinates
        if point["latitude"] == 0.0 and point["longitude"] == 0.0:
            continue

        zone = is_low_network_zone(point["latitude"], point["longitude"])

        if not zone:
            continue

        if not current_zone:
            # start new zone
            current_zone = {
                "from": point["station"],
                "to": point["station"],
                "severity": zone["severity"],
                "radio": zone.get("radio")
            }
            last_alert_point = point
            continue

        # distance from last alert point
        gap = haversine_m(
            last_alert_point["latitude"],
            last_alert_point["longitude"],
            point["latitude"],
            point["longitude"]
        )

        if gap <= MAX_ZONE_GAP_M:
            # extend current zone
            current_zone["to"] = point["station"]

            # upgrade severity if worse
            if SEVERITY_ORDER[zone["severity"]] > SEVERITY_ORDER[current_zone["severity"]]:
                current_zone["severity"] = zone["severity"]

            last_alert_point = point
        else:
            # close current zone, start new
            zones.append(current_zone)
            current_zone = {
                "from": point["station"],
                "to": point["station"],
                "severity": zone["severity"],
                "radio": zone.get("radio")
            }
            last_alert_point = point

    if current_zone:
        zones.append(current_zone)

    return zones
