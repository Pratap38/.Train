import json
from collections import defaultdict
from django.core.management.base import BaseCommand
from trains.models import Train, Station
from tracking.models import Route, TrainPath


class Command(BaseCommand):
    help = "Load stations, trains, routes and train geometry data"

    def handle(self, *args, **kwargs):

        # ===============================
        # 🔧 HELPERS
        # ===============================
        def clean_time(value):
            """
            Normalize invalid time values coming from raw datasets.
            Django TimeField accepts ONLY datetime.time or None.
            """
            if value in (None, "", "None", " "):
                return None
            return value

        # ===============================
        # 1️⃣ STATIONS
        # ===============================
        with open("datasets/stations.json", "r", encoding="utf-8") as f:
            stations_data = json.load(f)

        for code, name in stations_data.items():
            Station.objects.get_or_create(
                traincode=code,
                defaults={"name": name}
            )

        self.stdout.write(self.style.SUCCESS("✔ Stations imported"))

        # ===============================
        # 2️⃣ TRAINS + TRAIN PATH (GEO)
        # ===============================
        with open("datasets/trains.json", "r", encoding="utf-8") as f:
            geo_data = json.load(f)

        for feature in geo_data.get("features", []):
            props = feature.get("properties", {})

            # Safe distance handling
            raw_distance = props.get("distance")
            distance_km = None
            if raw_distance not in ("", None):
                try:
                    distance_km = float(raw_distance)
                except (TypeError, ValueError):
                    distance_km = None

            train, _ = Train.objects.get_or_create(
                train_number=str(props.get("number")),
                defaults={
                    "name": props.get("name") or ""
                }
            )

            TrainPath.objects.update_or_create(
                train=train,
                defaults={
                    "geometry": feature.get("geometry"),
                    "distance_km": distance_km
                }
            )

        self.stdout.write(self.style.SUCCESS("✔ Train paths imported"))

       # ===============================
# 3️⃣ ROUTES (SCHEDULES) — FAST
# ===============================

        with open("datasets/schedules.json", "r", encoding="utf-8") as f:
            schedules = json.load(f)

        # 🔧 Time sanitizer (MANDATORY)
        def clean_time(value):
            if value in (None, "", "None", " "):
                return None
            return value

        # 🚀 Preload stations ONCE (kills N+1 query problem)
        station_map = {
            s.traincode: s
            for s in Station.objects.all()
        }

        # Group stops by train number
        train_groups = defaultdict(list)
        for row in schedules:
            train_groups[row.get("train_number")].append(row)

        for train_number, stops in train_groups.items():
            try:
                train = Train.objects.get(train_number=train_number)
            except Train.DoesNotExist:
                continue

            # 🔥 Clear old routes (idempotent reload)
            Route.objects.filter(train=train).delete()

            # Safe sort by day + time
            def sort_key(stop):
                try:
                    day = int(stop.get("day"))
                except (TypeError, ValueError):
                    day = 1

                time_str = (
                    clean_time(stop.get("arrival"))
                    or clean_time(stop.get("departure"))
                    or "00:00:00"
                )
                return (day, time_str)

            stops.sort(key=sort_key)

            routes = []
            stop_no = 1

            for stop in stops:
                station = station_map.get(stop.get("station_code"))
                if not station:
                    continue

                routes.append(
                    Route(
                        train=train,
                        station=station,
                        stop_number=stop_no,
                        arrival_time=clean_time(stop.get("arrival")),
                        departure_time=clean_time(stop.get("departure")),
                    )
                )
                stop_no += 1

            # 🚀 Bulk insert (CRITICAL for speed)
            Route.objects.bulk_create(routes, batch_size=1000)

        self.stdout.write(self.style.SUCCESS("✔ Routes imported (FAST)"))
