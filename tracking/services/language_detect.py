import re

HINDI_PATTERN = re.compile(r'[\u0900-\u097F]')

# English intent keywords
ENGLISH_WORDS = [
    "train", "number", "from", "to", "search", "go",
    "find", "show", "status"
]

HINDI_WORDS = [
    "mujhe", "jana", "jaana", "dikhana", "dikhao",
    "batao", "ka", "ki", "hai", "se", "tak"
]

def detect(text:str)->str:
    text=text.lower()
    if HINDI_PATTERN.search(text):
        return "hindi"
    engli_score=sum(word in text for word in ENGLISH_WORDS)
    hindi_score=sum(word in text for word in HINDI_WORDS)
    if engli_score>0 and hindi_score>0:
        return "hinglish"
    if hindi_score>engli_score:
        return"hindi"
    return "english"

# import re
# from typing import List, Tuple

# # ----------------------------------------------------------------------
# # 1️⃣  Utility – clean the raw string
# # ----------------------------------------------------------------------
# def _clean_text(txt: str) -> str:
#     """
#     Keeps only letters (English + Devanagari), digits and spaces.
#     Removes any “hidden” characters, punctuation, emojis, etc.
#     Normalises whitespace to a single space.
#     """
#     # 1️⃣ Keep: Unicode Devanagari block + basic Latin letters + digits
#     #    We also keep spaces so we can tokenise later.
#     kept = r"[\u0900-\u097F\w\s]"
#     cleaned = re.sub(r"[^" + kept + "]", " ", txt)
#     # 2️⃣ Collapse multiple spaces
#     cleaned = re.sub(r"\s+", " ", cleaned).strip()
#     return cleaned


# # ----------------------------------------------------------------------
# # 2️⃣  Keyword lists – whole‑word matching (case‑insensitive)
# # ----------------------------------------------------------------------
# # English intents – you can extend this list as needed
# ENGLISH_KEYWORDS = {
#     "train", "number", "from", "to", "search", "go",
#     "find", "show", "status", "book", "ticket", "schedule",
#     "time", "date", "price", "available", "yes", "no"
# }

# # Hindi intents – use the *Devanagari* spellings you actually hear
# # (you can add more; keep them lower‑cased for matching)
# HINDI_KEYWORDS = {
#     "मुझे", "जाना", "जानना", "दिखाना", "दिखाओ",
#     "बताओ", "का", "कि", "है", "से", "तक",
#     "कैसे", "कब", "कहाँ", "किस", "क्या", "हो",
#     "करो", "दो", "ले", "लो"
# }

# # ----------------------------------------------------------------------
# # 3️⃣  Core detection routine
# # ----------------------------------------------------------------------
# def detect(text: str) -> str:
#     """
#     Returns one of:
#         "hindi"   – mostly Hindi (Devanagari) with few/no English tokens
#         "english" – mostly English with few/no Hindi tokens
#         "hinglish"– mixed script & mixed keywords
#         "unknown" – empty/garbage input
#     """
#     if not isinstance(text, str) or not text.strip():
#         return "unknown"

#     # ------------------------------------------------------------------
#     # 1️⃣ Clean & normalise
#     # ------------------------------------------------------------------
#     cleaned = _clean_text(text.lower())   # lower‑case for keyword look‑ups

#     # ------------------------------------------------------------------
#     # 2️⃣ Count script characters (Devanagari vs Latin)
#     # ------------------------------------------------------------------
#     hindi_char_pat = re.compile(r"[\u0900-\u097F]")
#     latin_char_pat = re.compile(r"[a-z]")

#     hindi_char_cnt = len(hindi_char_pat.findall(cleaned))
#     latin_char_cnt = len(latin_char_pat.findall(cleaned))

#     total_char_cnt = len(cleaned) or 1  # avoid division by zero
#     hindi_char_ratio = hindi_char_cnt / total_char_cnt
#     latin_char_ratio = latin_char_cnt / total_char_cnt

#     # ------------------------------------------------------------------
#     # 3️⃣ Tokenise (split on whitespace – works fine after cleaning)
#     # ------------------------------------------------------------------
#     tokens: List[str] = cleaned.split()

#     # ------------------------------------------------------------------
#     # 4️⃣ Whole‑word keyword scoring
#     # ------------------------------------------------------------------
#     eng_score = sum(1 for t in tokens if t in ENGLISH_KEYWORDS)
#     hin_score = sum(1 for t in tokens if t in HINDI_KEYWORDS)

#     # ------------------------------------------------------------------
#     # 5️⃣ Decision logic
#     # ------------------------------------------------------------------
#     # If BOTH scripts appear *significantly* we call it hinglish
#     if hindi_char_cnt > 0 and latin_char_cnt > 0:
#         # Both scripts present – look at keyword balance
#         if eng_score > 0 and hin_score > 0:
#             return "hinglish"

#         # If one script dominates (≥ 30% of characters) we trust the script,
#         # otherwise we trust the keyword count (helps when speech‑to‑text
#         # produces a lot of Latin noise but the user actually spoke Hindi)
#         if hindi_char_ratio >= 0.30:
#             return "hindi"
#         elif latin_char_ratio >= 0.30:
#             return "english"
#         else:
#             # Fallback to keyword majority
#             return "hindi" if hin_score > eng_score else "english"

#     # Only Hindi characters → Hindi
#     if hindi_char_cnt > 0:
#         return "hindi"

#     # Only English characters → English
#     if latin_char_cnt > 0:
#         return "english"

#     # No recognisable characters (e.g. only digits)
#     return "unknown"


# # ----------------------------------------------------------------------
# # 6️⃣  Optional: fuzzy‑match for speech‑to‑text errors
# # ----------------------------------------------------------------------
# try:
#     from thefuzz import fuzz, process
# except ImportError:
#     # User doesn’t have thefuzz installed – we’ll just fall back to exact match
#     fuzz = None


# def _fuzzy_match_keyword(token: str, keyword_set: set, threshold: int = 80) -> bool:
#     """
#     Returns True if `token` is within `threshold` similarity to *any* keyword
#     in `keyword_set`.  Uses thefuzz if installed, otherwise does exact match.
#     """
#     if not fuzz:
#         return token in keyword_set

#     # Convert set to list once (thefuzz `process.extractOne` needs a list)
#     best = process.extractOne(token, keyword_set, scorer=fuzz.ratio)
#     return best is not None and best[1] >= threshold


# def detect_fuzzy(text: str, eng_thresh: int = 2, hin_thresh: int = 2) -> str:
#     """
#     Same logic as `detect` but uses fuzzy matching for the keyword scores.
#     `eng_thresh`/`hin_thresh` define how many *fuzzy* keyword hits we need
#     to consider a language “present”.
#     """
#     if not isinstance(text, str) or not text.strip():
#         return "unknown"

#     cleaned = _clean_text(text.lower())
#     tokens = cleaned.split()

#     # Script ratios (same as before)
#     hindi_char_pat = re.compile(r"[\u0900-\u097F]")
#     latin_char_pat = re.compile(r"[a-z]")

#     hindi_char_cnt = len(hindi_char_pat.findall(cleaned))
#     latin_char_cnt = len(latin_char_pat.findall(cleaned))
#     total_char_cnt = len(cleaned) or 1
#     hindi_char_ratio = hindi_char_cnt / total_char_cnt
#     latin_char_ratio = latin_char_cnt / total_char_cnt

#     # Fuzzy keyword scoring
#     eng_fuzzy = sum(
#         1
#         for t in tokens
#         if _fuzzy_match_keyword(t, ENGLISH_KEYWORDS)
#     )
#     hin_fuzzy = sum(
#         1
#         for t in tokens
#         if _fuzzy_match_keyword(t, HINDI_KEYWORDS)
#     )

#     # Decision tree (same as before, just replace eng_score → eng_fuzzy)
#     if hindi_char_cnt > 0 and latin_char_cnt > 0:
#         if eng_fuzzy >= eng_thresh and hin_fuzzy >= hin_thresh:
#             return "hinglish"
#         if hindi_char_ratio >= 0.30:
#             return "hindi"
#         elif latin_char_ratio >= 0.30:
#             return "english"
#         else:
#             return "hindi" if hin_fuzzy > eng_fuzzy else "english"

#     if hindi_char_cnt > 0:
#         return "hindi"
#     if latin_char_cnt > 0:
#         return "english"
#     return "unknown"