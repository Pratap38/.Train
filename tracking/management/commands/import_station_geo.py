import json
from django.core.management.base import BaseCommand
from trains.models import Station


class Command(BaseCommand):
    help = "Import station latitude & longitude from GeoJSON"

    def handle(self, *args, **kwargs):
        with open("datasets/stations.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        updated = 0
        skipped = 0

        for feature in data.get("features", []):
            geometry = feature.get("geometry")
            props = feature.get("properties", {})

            if not geometry:
                skipped += 1
                continue

            coords = geometry.get("coordinates")
            if not coords or len(coords) != 2:
                skipped += 1
                continue

            longitude, latitude = coords
            station_code = props.get("code")

            if not station_code:
                skipped += 1
                continue

            try:
                station = Station.objects.get(traincode=station_code)
                station.latitude = latitude
                station.longitude = longitude
                station.save()
                updated += 1
            except Station.DoesNotExist:
                skipped += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Stations updated: {updated}, skipped: {skipped}"
            )
        )
