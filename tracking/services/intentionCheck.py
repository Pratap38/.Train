from tracking.services.voiceCodeExtract import exctract_num
from tracking.services.station_mapper import extract_stations_from_text


def detect_intent(text: str):
    """
    Detect user intent from voice text.
    """

    text = text.lower().strip()

    # ------------------------------------------------
    # 1️⃣ TRAIN NUMBER INTENT
    # ------------------------------------------------
    train_number = exctract_num(text)
    if train_number:
        return {
            "intent": "train_status",
            "train_number": train_number
        }

    # ------------------------------------------------
    # 2️⃣ ROUTE SEARCH INTENT (keyword based trigger)
    # ------------------------------------------------
    if " se " in text or ("from" in text and "to" in text):

        from_station, to_station = extract_stations_from_text(text)

        return {
            "intent": "route_search",
            "from_station": from_station,
            "to_station": to_station
        }

    # ------------------------------------------------
    # 3️⃣ UNKNOWN
    # ------------------------------------------------
    return {
        "intent": "unknown"
    }
