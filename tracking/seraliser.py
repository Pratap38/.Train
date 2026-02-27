from rest_framework import serializers
from .models import Route
from trains.serializers import  StationSerializer

class RouteSerializer(serializers.ModelSerializer):
      station =StationSerializer
      class Meta:
           model=Route
           field=[
                'stop_number',
            'station',
            'arrival_time',
            'departure_time'
               ]





