from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from tracking.services.network_detect import (
  
    detect_low_network_ahead,
    timezoneEstimator,mergeRoutXone,
)
from django.http import JsonResponse
from tracking.services.train_search import search_stations, find_trains_between,get_station_code
from tracking.services.language_detect import detect
from tracking.services.intentionCheck import detect_intent
from tracking.services.station_mapper import load_station_data
from tracking.services.train_number_handler import handler
from tracking.services.train_status_service import get_train_status_data
from tracking.services.aiResponse_builder import buildResponse, build_fallback_response

from trains.models import Train
from tracking.models import Route, Traincache

from .utils import (
    timeline,
    is_cache_stale,
    detect_lowNetwork,
    propagate_delay,
    ETACalculator,
    calculate_progress,
    build_Map,              # map route builder
    getcurrentPosition      # interpolation
)

from .response import build_train_response
import math

# class TrainStatusAPIView(APIView):
#     def get(self, request, train_number):

#         # ---- TRAIN ----
#         try:
#             train = Train.objects.get(train_number=train_number)
#         except Train.DoesNotExist:
#             return Response(
#                 {"success": False, "error": "Train not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         # ---- ROUTE ----
#         route = list(Route.objects.filter(train=train).order_by("stop_number"))
#         if not route:
#             return Response(
#                 {"success": False, "error": "Route not found"},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         # ---- CURRENT + NEXT STOP ----
#         current_index = 0
#         current_stop = route[current_index]
#         next_stop = route[current_index + 1] if len(route) > 1 else None

#         # ---- DISTANCE ----
#         distance_remaining = None
#         if hasattr(train, "path") and train.path.distance_km:
#             distance_remaining = train.path.distance_km / len(route)

#         # ---- DELAY (SIMULATED) ----
#         delay_min = 10

#         # ---- MAP DATA (DAY 13 CORE) ----
#         # ---- MAP DATA (DAY 13 CORE) ----
#         route_points = build_Map(route)
#         low_network_alerts = detect_low_network_ahead(route_points)
#         zones = mergeRoutXone(route_points)
#         # ---- ETA + PROGRESS ----
#         eta_min = ETACalculator(distance_remaining, delay_min)
#         elapsed_min = 5  # polling-based later
#         progress = calculate_progress(elapsed_min, eta_min)

#         # ---- CURRENT POSITION (MUST COME FIRST) ----
#         current_position = getcurrentPosition(route_points, progress)

#         # ---- TIME TO LOW NETWORK ZONES (NOW SAFE) ----
#         zone_predictions = timezoneEstimator(
#             current_position,
#             low_network_alerts,
#             distance_remaining,
#             eta_min
#         )
        

#         # ---- CACHE CHECK ----
#         cache = getattr(train, "cache", None)
#         if cache and not is_cache_stale(cache.last_updated):
#             return Response(
#     build_train_response(
#         train=train,
#         current_station=cache.current_station_name,
#         next_station=next_stop.station.name if next_stop else None,
#         distance_remaining=distance_remaining,
#         timeline=cache.journey_time,
#         cached=True,
#         eta_minutes=eta_min,
#         delay_map=propagate_delay(route, current_index, delay_min),
#         network_alerts=low_network_alerts,
#         map_route=route_points,
#         current_position=current_position,
#         time_to_low_network=zone_predictions,
#         low_network_zones=zones     # ✅ ADD
#     ),
#     status=status.HTTP_200_OK
# )



#         # ---- CACHE MISS ----
#         timeline_data = timeline(route, current_stop.station.name)

#         Traincache.objects.update_or_create(
#             train=train,
#             defaults={
#                 "current_station_name": current_stop.station.name,
#                 "journey_time": timeline_data
#             }
#         )

#         return Response(
#     build_train_response(
#         train=train,
#         current_station=current_stop.station.name,
#         next_station=next_stop.station.name if next_stop else None,
#         distance_remaining=distance_remaining,
#         timeline=timeline_data,
#         cached=False,
#         eta_minutes=eta_min,
#         delay_map=propagate_delay(route, current_index, delay_min),
#         network_alerts=detect_lowNetwork(route),
#         map_route=route_points,
#         current_position=current_position,
#         time_to_low_network=zone_predictions,
#         low_network_zones=zones     # ✅ ADD
#     ),
#     status=status.HTTP_200_OK
# )
class TrainStatusAPIView(APIView):

    def get(self, request, train_number):

        data = get_train_status_data(train_number)

        if not data or data.get("success") is False:
            return Response(
                {"success": False, "error": "Train not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(data, status=status.HTTP_200_OK)



class TrauinRouteApi(APIView):
    def get(self, request, train_number):
        try:
            train = Train.objects.get(train_number=train_number)
        except Train.DoesNotExist:
            return Response(
                {"success": False, "error": "Train not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        routes = Route.objects.filter(train=train).order_by("stop_number")
        if not routes.exists():
            return Response(
                {"success": False, "error": "Route not available"},
                status=status.HTTP_404_NOT_FOUND
            )

        route_data = []
        for stop in routes:
            route_data.append({
                "stop_number": stop.stop_number,
                "station_name": stop.station.name,
                "station_code": stop.station.traincode,
                "arrival_time": stop.arrival_time.strftime("%H:%M:%S") if stop.arrival_time else None,
                "departure_time": stop.departure_time.strftime("%H:%M:%S") if stop.departure_time else None
            })

        return Response(
            {
                "success": True,
                "data": {
                    "train_number": train.train_number,
                    "train_name": train.name,
                    "total_stops": routes.count(),
                    "route": route_data
                }
            },
            status=status.HTTP_200_OK
        )
###network low api seprate taki load kam hojaye

class TrainAlertAPI(APIView):
    def get(self,request,train_number):
        try:
            train=Train.objects.get(train_number=train_number)
        except Train.DoesNotExist:
            return Response({
                "success":False,
                "error":"Train Not Found"
            },
            status=status.HTTP_404_NOT_FOUND
            )
        route = list(Route.objects.filter(train=train).order_by("stop_number"))
        if not route:
            return Response({
                "success":False,
                "error":"Route Not Found",
            }, status=status.HTTP_404_NOT_FOUND
            )
        MapRoute=build_Map(route)

        DistanceRemain=train.path.distance_km / len(route)
        ETA_Min=ETACalculator(DistanceRemain,delayMin=10)
        progress=calculate_progress(elapsed_min=5,eta_min=ETA_Min)

        current_position=getcurrentPosition(MapRoute,progress)

        alerts=detect_low_network_ahead(MapRoute)

        prediction=timezoneEstimator(
            current_position,
            alerts,
            DistanceRemain,
            ETA_Min,
        )

        return Response({
            "success":True,
            "train_number":train.train_number,
            "alert":prediction,
            "cached":True
        },
        status=status.HTTP_200_OK
        )

#3offline backupp part-2

class OfflineBackupAPI(APIView):
    def get(self, request, train_number):

        # ---- TRAIN ----
        try:
            train = Train.objects.get(train_number=train_number)
        except Train.DoesNotExist:
            return Response(
                {"success": False, "error": "Train not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # ---- ROUTE ----
        route = list(Route.objects.filter(train=train).order_by("stop_number"))
        if not route:
            return Response(
                {"success": False, "error": "Route not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # ---- MAP ROUTE ----
        MapRoute = build_Map(route)

        # ---- ETA (BASE) ----
        distance_remaining = train.path.distance_km / len(route)
        ETA_min = ETACalculator(distance_remaining, delayMin=10)

        # ---- NETWORK ALERTS ----
        alerts = detect_low_network_ahead(MapRoute)

        # ---- CACHE DECISION ----
        cache_now = False
        if alerts:
            upcoming = {s["station"] for s in MapRoute[:5]}
            risky = {a["station"] for a in alerts}
            if upcoming & risky:
                cache_now = True

        # ---- OFFLINE PACKAGE ----
        offline_pack = {
            "validMin": 45,
            "station": [],
            "network_alerts": [
                {
                    "station": a["station"],
                    "severity": a["severity"]
                }
                for a in alerts
            ]
        }

        # ---- ✅ STRICT ETA PER STATION (FINAL FIX) ----
        eta_counter = 0  # minutes

        for i, stop in enumerate(MapRoute[:5]):
            if i == 0:
                offline_pack["station"].append({
                    "name": stop["station"],
                    "eta_min": 0
                })
                continue

            eta_counter += 1  # always increase by 1 minute

            offline_pack["station"].append({
                "name": stop["station"],
                "eta_min": eta_counter
            })

        return Response(
            {
                "success": True,
                "train_number": train.train_number,
                "offline_package": offline_pack,
                "cache_now": cache_now
            },
            status=status.HTTP_200_OK
        )

# search wala api

def train_search_api(request):
    from_station = request.GET.get("from")
    to_station = request.GET.get("to")

    if not from_station or not to_station:
        return JsonResponse({
            "success": False,
            "error": "from and to parameters required"
        }, status=400)

    trains = find_trains_between(from_station, to_station)

    from_code = get_station_code(from_station)
    to_code = get_station_code(to_station)

    return JsonResponse({
        "success": True,
        "from": from_code,
        "to": to_code,
        "trains": trains
    })

##now voice wala cammadn
# class VoiceCommandAPIView(APIView):

#     def post(self, request):

#         try:
#             text = request.data.get("text")

#             # 1️⃣ Empty command
#             if not text:
#                 language = "english"
#                 return Response({
#                     "success": False,
#                     "language": language,
#                     "intent": None,
#                     "speech_text": build_fallback_response(
#                         "EMPTY_COMMAND",
#                         language
#                     )
#                 }, status=status.HTTP_400_BAD_REQUEST)

#             # 2️⃣ Detect language
#             language = detect(text)

#             # 3️⃣ Load station mapping
#             load_station_data()

#             # 4️⃣ Detect intent
#             intent_data = detect_intent(text)
#             intent = intent_data.get("intent")
#             train_number = intent_data.get("train_number")

#             # ------------------------------------------------
#             # 🚆 TRAIN STATUS INTENT
#             # ------------------------------------------------
#             if intent == "train_status" and train_number:

#                 train_data = get_train_status_data(train_number)

#                 if not train_data or train_data.get("success") is False:
#                     return Response({
#                         "success": False,
#                         "language": language,
#                         "intent": intent,
#                         "speech_text": build_fallback_response(
#                             "TRAIN_NOT_FOUND",
#                             language
#                         )
#                     }, status=status.HTTP_404_NOT_FOUND)

#                 spoken_message = buildResponse(
#                     train_data,
#                     language=language
#                 )

#                 return Response({
#                     "success": True,
#                     "language": language,
#                     "intent": intent,
#                     "speech_text": spoken_message,
#                     "data": train_data
#                 }, status=status.HTTP_200_OK)

#             # ------------------------------------------------
#             # 🚉 ROUTE SEARCH INTENT
#             # ------------------------------------------------
#             if intent == "route_search":

#                 from_station = intent_data.get("from_station")
#                 to_station = intent_data.get("to_station")

#                 if not from_station or not to_station:
#                     return Response({
#                         "success": False,
#                         "language": language,
#                         "intent": intent,
#                         "speech_text": build_fallback_response(
#                             "STATION_NOT_FOUND",
#                             language
#                         )
#                     }, status=status.HTTP_400_BAD_REQUEST)

#                 trains = find_trains_between(from_station, to_station)

#                 if not trains:
#                     return Response({
#                         "success": False,
#                         "language": language,
#                         "intent": intent,
#                         "speech_text": build_fallback_response(
#                             "NO_TRAINS_FOUND",
#                             language
#                         )
#                     }, status=status.HTTP_404_NOT_FOUND)

#                 return Response({
#                     "success": True,
#                     "language": language,
#                     "intent": intent,
#                     "from": from_station,
#                     "to": to_station,
#                     "trains": trains
#                 }, status=status.HTTP_200_OK)

#             # ------------------------------------------------
#             # ❓ UNKNOWN INTENT
#             # ------------------------------------------------
#             return Response({
#                 "success": False,
#                 "language": language,
#                 "intent": intent,
#                 "speech_text": build_fallback_response(
#                     "INTENT_NOT_UNDERSTOOD",
#                     language
#                 )
#             }, status=status.HTTP_400_BAD_REQUEST)

#         except Exception as e:
#             return Response({
#                 "success": False,
#                 "language": "english",
#                 "intent": None,
#                 "speech_text": build_fallback_response(
#                     "INTERNAL_ERROR",
#                     "english"
#                 ),
#                 "error": str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        













class VoiceCommandAPIView(APIView):

    def post(self, request):
        try:
            text = request.data.get("text")

            # 1️⃣ EMPTY COMMAND
            if not text:
                language = "english"
                return Response({
                    "success": False,
                    "language": language,
                    "intent": None,
                    "speech_text": build_fallback_response(
                        "EMPTY_COMMAND",
                        language
                    )
                }, status=status.HTTP_400_BAD_REQUEST)

            # 2️⃣ DETECT LANGUAGE
            language = detect(text)

            # 3️⃣ LOAD STATION DATA
            load_station_data()

            # 4️⃣ DETECT INTENT
            intent_data = detect_intent(text)
            intent = intent_data.get("intent")
            train_number = intent_data.get("train_number")

            # ------------------------------------------------
            # 🚆 TRAIN STATUS INTENT
            # ------------------------------------------------
            if intent == "train_status" and train_number:

                train_data = get_train_status_data(train_number)

                if not train_data or train_data.get("success") is False:
                    return Response({
                        "success": False,
                        "language": language,
                        "intent": intent,
                        "speech_text": build_fallback_response(
                            "TRAIN_NOT_FOUND",
                            language
                        )
                    }, status=status.HTTP_404_NOT_FOUND)

                spoken_message = buildResponse(
                    train_data,
                    language=language
                )

                return Response({
                    "success": True,
                    "language": language,
                    "intent": intent,
                    "speech_text": spoken_message,
                    "data": train_data.get("data")  # ✅ IMPORTANT (as you mentioned)
                }, status=status.HTTP_200_OK)

            # ------------------------------------------------
            # 🚉 ROUTE SEARCH INTENT
            # ------------------------------------------------
            if intent == "route_search":

                from_station = intent_data.get("from_station")
                to_station = intent_data.get("to_station")

                if not from_station or not to_station:
                    return Response({
                        "success": False,
                        "language": language,
                        "intent": intent,
                        "speech_text": build_fallback_response(
                            "STATION_NOT_FOUND",
                            language
                        )
                    }, status=status.HTTP_400_BAD_REQUEST)

                trains = find_trains_between(from_station, to_station)

                if not trains:
                    return Response({
                        "success": False,
                        "language": language,
                        "intent": intent,
                        "speech_text": build_fallback_response(
                            "NO_TRAINS_FOUND",
                            language
                        )
                    }, status=status.HTTP_404_NOT_FOUND)

                return Response({
                    "success": True,
                    "language": language,
                    "intent": intent,
                    "from": from_station,
                    "to": to_station,
                    "trains": trains
                }, status=status.HTTP_200_OK)

            # ------------------------------------------------
            # ❓ UNKNOWN INTENT
            # ------------------------------------------------
            return Response({
                "success": False,
                "language": language,
                "intent": intent,
                "speech_text": build_fallback_response(
                    "INTENT_NOT_UNDERSTOOD",
                    language
                )
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "success": False,
                "language": "english",
                "intent": None,
                "speech_text": build_fallback_response(
                    "INTERNAL_ERROR",
                    "english"
                ),
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





##offline backup working 
# class OfflineBackupAPI(APIView):
#     def get(self,request,train_number):

#         try:
#             train=Train.objects.get(train_number=train_number)
#         except Train.DoesNotExist:
#             return Response({
#                 "success":False,
#                 "error":"Train not Found"
#             },
#             status=status.HTTP_404_NOT_FOUND)
#         route = list(Route.objects.filter(train=train).order_by("stop_number"))
#         if not route:
#             return Response({
#                 "success":False,
#                 "error":"Route not found"
#             },
#             status=status.HTTP_200_OK)
#         MapRoute=build_Map(route)
#         distanceRemain=train.path.distance_km/len(route)
#         ETA_min=ETACalculator(distanceRemain,delayMin=10)
#         alerts = detect_low_network_ahead(MapRoute)

#         cache_now=False
#         if alerts:
#             time_to_zone=alerts[0].get("time_to_zone_min",999)
#             if time_to_zone <=30:
#                 cache_now=True
#             offline_pack={
#                 "validMin":45,
#                 "station":[{
#                     "name":stop["station"],
#                     "eta_min":round((idx/len(MapRoute))*ETA_min,1)
#                 }
#                 for idx,stop in enumerate(MapRoute[:5])],
#                 "network_alerts":[{
#                     "station":a["station"],
#                     "severity":a["severity"]
#                 }
#                 for a in alerts
#                 ]
#             }
#             return Response({
#                 "success":True,
#                 "train_number":train.train_number,
#                 "offline_package":offline_pack,
#                 "cache_now":cache_now
#             },
#             status=status.HTTP_200_OK)








# class TrainStatusAPIView(APIView):

#     def get(self, request, train_number):

    
#         try:
#             train = Train.objects.get(train_number=train_number)
#         except Train.DoesNotExist:
#             return Response(
#                 {
#                     "success": False,
#                     "error": {
#                         "code": "TRAIN_NOT_FOUND",
#                         "message": "Train not found"
#                     }
#                 },
#                 status=status.HTTP_404_NOT_FOUND
#             )

    
#         cache = getattr(train, "cache", None)

#         if cache and not is_cache_stale(cache.last_updated):  ##if no any route found
#             return Response(
#                 {
#                     "success": True,
#                     "data": {
#                         "train_number": train.train_number,
#                         "train_name": train.name,
#                         "current_station": cache.current_station_name,
#                         "journey_timeline": cache.journey_time,
#                         "cached": True,
#                         "last_updated": cache.last_updated
#                     }
#                 },
#                 status=status.HTTP_200_OK
#             )

#         route = Route.objects.filter(train=train).select_related("station")
#         if not route.exists():
#             return Response(
#                 {
#                     "success": False,
#                     "error": {
#                         "code": "ROUTE_NOT_FOUND",
#                         "message": "Route not found for this train"
#                     }
#                 },
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         # 4️⃣ Current station
#         current_station_name = (
#             route[1].station.name if route.count() > 1 else route[0].station.name
#         )

#         timeline_data = timeline(route, current_station_name)

#         # 5️⃣ Save cache
#         Traincache.objects.update_or_create(
#             train=train,
#             defaults={
#                 "current_station_name": current_station_name,
#                 "journey_time": timeline_data
#             }
#         )

#         # 6️⃣ Response (cache MISS)
#         return Response(
#             {
#                 "success": True,
#                 "data": {
#                     "train_number": train.train_number,
#                     "train_name": train.name,
#                     "current_station": current_station_name,
#                     "journey_timeline": timeline_data,
#                     "cached": False,
#                     "last_updated": timezone.now()
#                 }
#             },
#             status=status.HTTP_200_OK
#         )
