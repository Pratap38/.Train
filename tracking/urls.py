from django.urls import path
from .views import TrainStatusAPIView,  TrauinRouteApi,TrainAlertAPI,OfflineBackupAPI,train_search_api,VoiceCommandAPIView
urlpatterns = [
    path('trainsapi/<int:train_number>/', TrainStatusAPIView.as_view()),
    path("trains/<str:train_number>/route/",  TrauinRouteApi.as_view()),
    path("train/<int:train_number>/network-alert",TrainAlertAPI.as_view()),
    path("train/<int:train_number>/offline-package",OfflineBackupAPI.as_view()),
    path("train/search", train_search_api),
     path("voice-command/", VoiceCommandAPIView.as_view(), name="voice-command"),
]

