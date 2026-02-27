from rest_framework import serializers
from .models import Train

class TrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Train
        fields = ['train_number', 'name']
class StationSerializer(serializers.ModelSerializer):
     class Meta:
         model = Station
         field= ['name','traincode','latitude','longitude']
