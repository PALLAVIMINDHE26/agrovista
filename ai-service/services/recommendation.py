from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

key = os.getenv("GEMINI_KEY_RECOMMEND")
print("RECOMMENDATION KEY LOADED:", key)

client = genai.Client(api_key=key)

FALLBACK_RECOMMENDATIONS = {
    "beach": {
        "destinations": ["Goa Coconut Farms", "Kerala Backwater Farms", "Konkan Mango Plantations"],
        "activities": ["Coconut picking", "Fish farming tour", "Coastal bird watching"],
        "bestTime": "October – February",
        "packages": "Overnight Stay or Weekend Experience",
        "tip": "Carry light cotton clothes and sunscreen!"
    },
    "mountain": {
        "destinations": ["Coorg Coffee Estates", "Munnar Tea Gardens", "Himachal Apple Orchards"],
        "activities": ["Tea/coffee picking", "Apple orchard walk", "Mountain bird watching"],
        "bestTime": "March – June or September – November",
        "packages": "Weekend Experience or Week-long Retreat",
        "tip": "Carry warm clothes even in summer!"
    },
    "culture": {
        "destinations": ["Rajasthan Desert Farms", "Punjab Agricultural Heritage", "Varanasi Rural Villages"],
        "activities": ["Folk dance shows", "Traditional cooking classes", "Handicraft workshops"],
        "bestTime": "October – March",
        "packages": "Day Visit or Overnight Stay",
        "tip": "Visit during harvest festivals for best experience!"
    },
    "adventure": {
        "destinations": ["Coorg Jungle Farms", "Uttarakhand Organic Farms", "Meghalaya Living Root Farms"],
        "activities": ["Nature trails", "River crossing", "Zip-lining near farms"],
        "bestTime": "October – April",
        "packages": "Weekend Experience or Week-long Retreat",
        "tip": "Book activities in advance during peak season!"
    },
    "family": {
        "destinations": ["Maharashtra Grape Farms", "Kerala Spice Plantations", "Punjab Wheat Farms"],
        "activities": ["Fruit picking", "Bullock cart rides", "Dairy farm visits"],
        "bestTime": "November – February",
        "packages": "Overnight Stay or Weekend Experience",
        "tip": "Great for kids — hands-on farming activities available!"
    },
    "budget": {
        "destinations": ["Local Maharashtra Farms", "Pune Agro Villages", "Nashik Vineyards"],
        "activities": ["Farm walks", "Organic lunch", "Basic farming workshops"],
        "bestTime": "Year-round",
        "packages": "Day Visit (₹999/person)",
        "tip": "Book weekdays for lower prices!"
    },
}

def get_fallback_recommendation(preferences: dict) -> dict:
    interest = preferences.get("interest", "").lower()
    budget = preferences.get("budget", "").lower()

    if "beach" in interest or "coastal" in interest:
        data = FALLBACK_RECOMMENDATIONS["beach"]
    elif "mountain" in interest or "hill" in interest:
        data = FALLBACK_RECOMMENDATIONS["mountain"]
    elif "culture" in interest or "festival" in interest:
        data = FALLBACK_RECOMMENDATIONS["culture"]
    elif "adventure" in interest or "trek" in interest:
        data = FALLBACK_RECOMMENDATIONS["adventure"]
    elif "family" in interest or "kids" in interest:
        data = FALLBACK_RECOMMENDATIONS["family"]
    elif "budget" in budget or "cheap" in budget or "low" in budget:
        data = FALLBACK_RECOMMENDATIONS["budget"]
    else:
        data = FALLBACK_RECOMMENDATIONS["family"]

    return {
        "destinations": data["destinations"],
        "activities": data["activities"],
        "bestTime": data["bestTime"],
        "packages": data["packages"],
        "tip": data["tip"],
        "summary": f"Based on your preferences, we recommend exploring these amazing agrotourism experiences in India!",
        "status": "fallback"
    }


async def get_recommendations(preferences: dict):
    try:
        prompt = f"""You are an expert agrotourism travel advisor for India.
Based on the following user preferences, give personalized agrotourism recommendations.

User Preferences:
- Group Type: {preferences.get('groupType', 'Not specified')}
- Budget: {preferences.get('budget', 'Not specified')}
- Duration: {preferences.get('duration', 'Not specified')}
- Interest: {preferences.get('interest', 'Not specified')}
- Season: {preferences.get('season', 'Not specified')}
- State Preference: {preferences.get('state', 'Any')}

Return ONLY a JSON response in this exact format with no extra text:
{{
    "summary": "2-3 sentence personalized summary",
    "destinations": ["Destination 1", "Destination 2", "Destination 3"],
    "activities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"],
    "bestTime": "Best time to visit based on season",
    "packages": "Recommended package name and price range",
    "tip": "One personalized travel tip",
    "whyThese": "One sentence explaining why these match their preferences"
}}"""

        response = client.models.generate_content(
            model="models/gemini-2.0-flash",
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=800,
            ),
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part(text=prompt)]
                )
            ]
        )

        import json
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)
        result["status"] = "success"
        return result

    except Exception as e:
        error_str = str(e)
        print("RECOMMENDATION ERROR:", error_str)

        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            return get_fallback_recommendation(preferences)
        elif "404" in error_str:
            return get_fallback_recommendation(preferences)
        else:
            return get_fallback_recommendation(preferences)