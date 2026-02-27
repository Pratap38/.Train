import json
import os
import re

STATION_LOOKUP = {}
STOPWORDS = {
    "to", "go", "from", "want", "i", "me",
    "hai", "jana", "assistant", "please",
    "se", "tak"
}


# def load_station_data():
#     global STATION_LOOKUP

#     base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
#     file_path = os.path.join(base_dir, "datasets", "stations.json")

#     with open(file_path, "r", encoding="utf-8") as f:
#         data = json.load(f)

#     features = data.get("features", [])

#     for feature in features:
#         properties = feature.get("properties", {})

#         name = properties.get("name")
#         code = properties.get("code")

#         if not name or not code:
#             continue

#         name = name.lower()
#         code = code.upper()

#         # Map full station name
#         STATION_LOOKUP[name] = code

#         # Map station code itself
#         STATION_LOOKUP[code.lower()] = code
# 2nd
def load_station_data():
    global STATION_LOOKUP

    if STATION_LOOKUP:
        return  # prevent reloading every request

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    file_path = os.path.join(base_dir, "datasets", "stations.json")

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Handle both possible formats
    if isinstance(data, dict):
        features = data.get("features", [])
    elif isinstance(data, list):
        features = data
    else:
        features = []

    for feature in features:

        # If GeoJSON
        if "properties" in feature:
            properties = feature.get("properties", {})
            name = properties.get("name")
            code = properties.get("code")
        else:
            name = feature.get("name")
            code = feature.get("code")

        if not name or not code:
            continue

        name = name.lower().strip()
        code = code.upper().strip()

        STATION_LOOKUP[name] = code
        STATION_LOOKUP[code.lower()] = code

    print("Stations loaded:", len(STATION_LOOKUP))


# def match_station_name(input_text):
#     input_text = input_text.lower().strip()

#     # Exact match first
#     if input_text in STATION_LOOKUP:
#         return STATION_LOOKUP[input_text]

#     # Partial match (station name contains input)
#     for name, code in STATION_LOOKUP.items():
#         if input_text in name:
#             return code

#     return None
# def match_station_name(input_text):
#     input_text = input_text.lower().strip()

#     if input_text in STATION_LOOKUP:
#         return STATION_LOOKUP[input_text]

#     if len(input_text) >= 4:
#         for name, code in STATION_LOOKUP.items():
#             if input_text in name:
#                 return code

#     return None

def clean_text(text):
    words = re.findall(r"[a-zA-Z]+", text.lower())
    words = [w for w in words if w not in STOPWORDS]
    return words
def match_station_name(input_text):
    input_text = input_text.lower().strip()

    # Remove common suffixes
    input_text = input_text.replace("jn", "").strip()
    input_text = input_text.replace("junction", "").strip()

    best_match = None

    for name, code in STATION_LOOKUP.items():
        clean_name = name.replace("jn", "").replace("junction", "").strip()

        # Exact match
        if input_text == clean_name:
            return code

        # Word-level match
        if input_text in clean_name.split():
            return code

        # Contains match
        if input_text in clean_name:
            best_match = code

    return best_match


# def extract_stations_from_text(text: str):
#     text = text.lower().strip()

#     # 1️⃣ Hindi pattern: X se Y
#     match = re.search(r'(\w+)\s+se\s+(\w+)', text)
#     if match:
#         from_code = match_station_name(match.group(1))
#         to_code = match_station_name(match.group(2))
#         if from_code and to_code:
#             return from_code, to_code

#     # 2️⃣ English pattern: from X to Y
#     match = re.search(r'from\s+(\w+)\s+to\s+(\w+)', text)
#     if match:
#         from_code = match_station_name(match.group(1))
#         to_code = match_station_name(match.group(2))
#         if from_code and to_code:
#             return from_code, to_code

#     # 3️⃣ Fallback: detect first two station words
#     words = clean_text(text)
#     found_codes = []

#     for word in words:
#         code = match_station_name(word)
#         if code:
#             found_codes.append(code)

#     if len(found_codes) >= 2:
#         return found_codes[0], found_codes[1]

#     return None, None










def extract_stations_from_text(text: str):
    text = text.lower().strip()

    # -------- Hindi Pattern --------
    match = re.search(r'([\w\s]+?)\s+se\s+([\w\s]+)', text)
    if match:
        from_text = match.group(1).split()[-1]
        to_text = match.group(2).split()[0]

        from_code = match_station_name(from_text)
        to_code = match_station_name(to_text)

        if from_code and to_code:
            return from_code, to_code

    # -------- English Pattern --------
    match = re.search(r'from\s+([\w\s]+?)\s+to\s+([\w\s]+)', text)
    if match:
        from_text = match.group(1).split()[-1]
        to_text = match.group(2).split()[0]

        from_code = match_station_name(from_text)
        to_code = match_station_name(to_text)

        if from_code and to_code:
            return from_code, to_code

    # -------- Fallback Word Scan --------
    words = clean_text(text)
    found_codes = []

    for word in words:
        code = match_station_name(word)
        if code and code not in found_codes:
            found_codes.append(code)

    if len(found_codes) >= 2:
        return found_codes[0], found_codes[1]

    return None, None
