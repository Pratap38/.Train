# tracking/management/commands/network_detect.py

from django.core.management.base import BaseCommand
from tracking.services.network_detect import (
    load_all_network_data,
    get_low_network_alert,
)


class Command(BaseCommand):
    help = "Load network data and test low network detection"

    def handle(self, *args, **kwargs):
        # load CSVs once
        load_all_network_data()
        self.stdout.write(self.style.SUCCESS("Network data loaded"))

        # example test (optional)
        alert = get_low_network_alert(25.1234, 86.5678)
        self.stdout.write(str(alert))
