from django.db import models
from trains.models import Train, Station

class Route(models.Model):
    train = models.ForeignKey(Train, on_delete=models.CASCADE, related_name="routes")
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    stop_number = models.PositiveIntegerField()
    arrival_time = models.TimeField(null=True, blank=True)
    departure_time = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ['stop_number']
        unique_together = ('train', 'stop_number')

    def __str__(self):
        return f"{self.train.train_number} - {self.station.name}"

##cache model mtlb cache data store k r rhe h 

class Traincache(models.Model):
    train=models.OneToOneField(Train,on_delete=models.CASCADE,related_name="cache")     ##act like an adharcard means unique identifaction pe kam
    current_station_name=models.CharField(max_length=200)
    journey_time=models.JSONField()
    low_network_alerts = models.JSONField(default=list) 
    last_updated=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cache for {self.train.train_number}"
    
class TrainPath(models.Model):
    train = models.OneToOneField(
        Train,
        on_delete=models.CASCADE,
        related_name="path"
    )
    geometry = models.JSONField()
    distance_km = models.FloatField(null=True, blank=True)


    def __str__(self):
        return f"Path for {self.train.train_number}"
