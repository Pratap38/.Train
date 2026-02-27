##train detail extraction wala station.json schedule.json

import json
import os
from datetime import datetime,timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "datasets")


Station_File=os.path.join(DATA_DIR,"stations.json")
Schedule_File=os.path.join(DATA_DIR,"schedules.json")

with open(Station_File, "r", encoding="utf-8") as f:
    STATIONS = json.load(f)

with open(Schedule_File, "r", encoding="utf-8") as f:
    TRAIN_SCHEDULES = json.load(f)

def calculate_duration(dep, arr):
    try:
        fmt = "%H:%M"
        dep_t = datetime.strptime(dep, fmt)
        arr_t = datetime.strptime(arr, fmt)

        if arr_t < dep_t:
            arr_t += timedelta(days=1)

        diff = arr_t - dep_t
        minutes = diff.seconds // 60
        hours = minutes // 60
        mins = minutes % 60

        return f"{hours}h {mins}m"
    except:
        return "N/A details"
    

def search_stations(query):
    query = query.lower()
    results = []

    features = STATIONS.get("features", [])

    for feature in features:
        props = feature.get("properties", {})
        name = props.get("name", "").lower()
        code = props.get("code", "").lower()

        if query in name or query in code:
            results.append({
                "name": props.get("name"),
                "code": props.get("code")
            })

    return results[:10]


   
def get_station_code(input_station):
    input_station = input_station.strip().lower()

    features = STATIONS.get("features", [])

    for feature in features:
        props = feature.get("properties", {})
        name = props.get("name", "").lower()
        code = props.get("code", "").upper()

        if input_station == name or input_station == code.lower():
            return code

    return input_station.upper()



def extract_code(station_name):
    # "Kirandul (KRDL)" → "KRDL"
    if "(" in station_name and ")" in station_name:
        return station_name.split("(")[-1].replace(")", "").strip()
    return station_name.strip().upper()
from collections import defaultdict

def find_trains_between(from_station, to_station):
    matches = []

    from_station = get_station_code(from_station)
    to_station = get_station_code(to_station)

    # group stops by train
    trains = defaultdict(list)

    for stop in TRAIN_SCHEDULES:
        train_key = stop.get("train_name")
        trains[train_key].append(stop)

    # search inside each train route
    for train_name, stops in trains.items():

    # SORT STOPS BY SEQUENCE IF AVAILABLE
        stops = sorted(stops, key=lambda x: x.get("stop_number", 0))

        from_index = None
        to_index = None

        for i, stop in enumerate(stops):
            code = stop.get("station_code", "").upper()

            if code == from_station and from_index is None:
                from_index = i

            if code == to_station and to_index is None:
                to_index = i

        # allow forward direction only
        if from_index is not None and to_index is not None and from_index < to_index:

            from_stop = stops[from_index]
            to_stop = stops[to_index]

            dep_time = from_stop.get("departure", "00:00")
            arr_time = to_stop.get("arrival", "00:00")

            duration = calculate_duration(dep_time[:5], arr_time[:5])

            # 🔑 extract train number safely
            train_number = from_stop.get("train_number")

            if not train_number:
                # fallback: extract from name like "12919 - Malwa Express"
                name_parts = train_name.split()
                if name_parts and name_parts[0].isdigit():
                    train_number = name_parts[0]
                else:
                    train_number = "00000"  # safe fallback

            matches.append({
                "train_number": train_number,
                "train_name": train_name,
                "from": from_station,
                "to": to_station,
                "departure_time": dep_time,
                "arrival_time": arr_time,
                "duration": duration
            })

    return matches