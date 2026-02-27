from django.db import models

class Train(models.Model):
    train_number = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.train_number} - {self.name}"
    
class Station(models.Model):
    name = models.CharField(max_length=100)
    traincode = models.CharField(max_length=10, unique=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.traincode})"
