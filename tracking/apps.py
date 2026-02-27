from django.apps import AppConfig

class TrackingConfig(AppConfig):
    name = "tracking"

    def ready(self):
        from tracking.services.network_detect import load_network_csv
        load_network_csv("tracking/data/network/404.csv")
