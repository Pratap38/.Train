def buildResponse(train_data, language="english"):

    # 🔥 Extract actual train info correctly
    data = train_data.get("data", {})

    train_number = data.get("train_number")
    train_name = data.get("train_name")
    current_station = data.get("current_station")
    next_station = data.get("next_station")
    eta = data.get("eta_minutes")

    if not train_number:
        if language in ["hindi", "hinglish"]:
            return "मुझे यह ट्रेन नहीं मिली।"
        return "I could not find this train."

    # 🌍 English Response
    if language == "english":
        return (
            f"Train {train_number} {train_name} is currently at "
            f"{current_station}. Next station is {next_station}. "
            f"ETA is {eta} minutes."
        )

    # 🇮🇳 Hindi / Hinglish Response
    return (
        f"Train {train_number} {train_name} abhi "
        f"{current_station} par hai. "
        f"Agla station {next_station} hai. "
        f"ETA {eta} minute hai."
    )
def build_fallback_response(error_code, language="english"):
    messages = {
        "EMPTY_COMMAND": {
            "english": "I didn't receive any command.",
            "hindi": "मुझे कोई आदेश प्राप्त नहीं हुआ।",
            "hinglish": "Mujhe koi command nahi mila."
        },
        "TRAIN_NOT_FOUND": {
            "english": "Sorry, I couldn't find that train.",
            "hindi": "क्षमा कीजिए, यह ट्रेन प्रणाली में उपलब्ध नहीं है।",
            "hinglish": "Sorry, yeh train system mein nahi mili."
        },
        "STATION_NOT_FOUND": {
            "english": "I couldn't recognize the station name.",
            "hindi": "मैं स्टेशन का नाम पहचान नहीं सका।",
            "hinglish": "Station ka naam samajh nahi aaya."
        },
        "INTENT_NOT_UNDERSTOOD": {
            "english": "I didn't understand your request.",
            "hindi": "मैं आपका अनुरोध समझ नहीं सका।",
            "hinglish": "Main aapka request samajh nahi paaya."
        },
        "INTERNAL_ERROR": {
            "english": "Something went wrong. Please try again.",
            "hindi": "कुछ त्रुटि हो गई है। कृपया पुनः प्रयास करें।",
            "hinglish": "Kuch galat ho gaya. Please phir se try karein."
        }
    }

    return messages.get(error_code, messages["INTERNAL_ERROR"]).get(
        language, messages["INTERNAL_ERROR"]["english"]
    )
