from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

key = os.getenv("GEMINI_KEY_CHAT")
print("CHATBOT KEY LOADED:", key)

client = genai.Client(api_key=key)

# ================= SYSTEM PROMPT =================
SYSTEM_PROMPT = """You are AgroVista AI Assistant — a friendly and knowledgeable expert in:
- Agrotourism destinations across India
- Indian agriculture and farming practices
- Plant diseases and crop health
- Rural tourism experiences and activities
- Indian culture and harvest festivals
- Farm stays, packages and booking guidance

Always give helpful, accurate, and concise responses.
If asked something unrelated to agriculture or agrotourism, politely redirect the user.
Format your responses cleanly. Use bullet points where helpful.
Keep responses friendly and encouraging."""


# ================= FALLBACK RESPONSES =================
FALLBACK_RESPONSES = {
    "hello": "👋 Hello! I'm AgroVista AI Assistant. I can help you with agrotourism destinations, farming tips, plant diseases, Indian culture and more!",
    
    "hi": "👋 Hi there! Ask me anything about agrotourism, farming or plant diseases!",
    
    "best destination": """🌿 Top Agrotourism Destinations in India:
- 🌴 Kerala Spice Plantations — organic spice farms & Ayurveda
- 🌾 Punjab Agricultural Heritage — tractor rides & wheat harvesting
- 🏜️ Rajasthan Desert Farming — sustainable irrigation & desert crops
- 🍇 Maharashtra Grape Farms — wine tours & grape picking
- ☕ Coorg Coffee Estates — coffee plantation walks
- 🍵 Assam Tea Gardens — tea picking & processing tours""",

    "kerala": """🌴 Kerala Agrotourism:
- Best time to visit: October – March
- Famous for spice farms, backwaters & organic farming
- Key activities: spice plantation walks, Ayurvedic treatments, houseboat stays
- Popular festivals: Onam (August-September)
- Must visit: Munnar tea gardens, Thekkady spice farms""",

    "punjab": """🌾 Punjab Agrotourism:
- Best time to visit: October – March
- Famous for wheat & rice farming heritage
- Key activities: tractor rides, wheat harvesting, bhangra cultural shows
- Popular festivals: Baisakhi (April)
- Must visit: Amritsar farms, Ludhiana agricultural university""",

    "rajasthan": """🏜️ Rajasthan Agrotourism:
- Best time to visit: October – February
- Famous for desert farming & sustainable irrigation
- Key activities: camel rides, desert crop tours, folk cultural shows
- Popular festivals: Makar Sankranti, Desert Festival
- Must visit: Jaisalmer farms, Pushkar organic farms""",

    "disease": """🌱 Plant Disease Detection Tips:
- Use our AI Disease Detector to upload plant images
- Common diseases: Early Blight, Late Blight, Powdery Mildew, Rust
- Prevention: proper irrigation, crop rotation, organic pesticides
- Treatment: copper-based fungicides for fungal diseases
- Visit our Disease Detector page for instant AI diagnosis!""",

    "festival": """🎉 Major Harvest Festivals in India:
- 🌸 Onam — Kerala (August-September) — harvest & boat races
- 🌾 Baisakhi — Punjab (April) — wheat harvest celebration
- 🌞 Pongal — Tamil Nadu (January) — rice harvest festival
- 🪁 Makar Sankranti — Gujarat (January) — kite festival & harvest
- 🌺 Nuakhai — Odisha (August-September) — new rice festival
- 🎊 Bihu — Assam (April) — agricultural new year""",

    "activities": """🎯 Farm Stay Activities Available:
- 🌱 Organic farming workshops
- 🐂 Bullock cart rides
- 🍓 Fruit & vegetable picking
- 👩‍🍳 Traditional cooking classes
- 🐦 Bird watching tours
- 🥛 Dairy farm visits & milk processing
- 🌿 Medicinal herb garden walks
- 🎨 Rural handicraft workshops
- 🌄 Nature & farm trail walks""",

    "package": """📦 Available Tour Packages:
- 🌅 Day Visit — ₹999/person (farm tour, organic lunch, activities)
- 🌙 Overnight Stay — ₹2,499/person (cottage, 3 meals, workshop)
- 🏕️ Weekend Experience — ₹4,999/person (premium stay, all meals)
- 🌿 Week-long Retreat — ₹12,999/person (full immersive experience)
Visit our Book Now page to reserve your experience!""",

    "book": """📅 How to Book:
1. Go to Destinations page and choose your farm
2. Click View Details then Continue to Booking
3. Select your package (Day/Overnight/Weekend/Week)
4. Choose number of guests and date
5. Add activity add-ons if needed
6. Complete secure payment via Razorpay
Your booking confirmation will be sent to your email!""",

    "price": """💰 Pricing Overview:
- Day Visit: ₹999 per person
- Overnight Stay: ₹2,499 per person
- Weekend Experience: ₹4,999 per person
- Week-long Retreat: ₹12,999 per person
- Activities: ₹100–₹500 per activity
- GST: 5% applicable on all bookings
All prices include meals and guided farm tours!""",

    "farming": """🌾 Indian Farming Practices:
- Organic farming — no chemical pesticides/fertilizers
- Drip irrigation — water conservation technique
- Crop rotation — maintaining soil health
- Intercropping — growing multiple crops together
- Traditional seeds — preserving indigenous varieties
- Composting — natural fertilizer production
India has 140M+ farmers practicing diverse agricultural methods!""",

    "bird": """🐦 Bird Watching at Agro Farms:
- Indian Peafowl — national bird, found near rural farms
- Kingfisher — seen near water bodies in agricultural areas
- Indian Roller — colorful bird in open farmlands
- Red-vented Bulbul — common in orchards and gardens
- Parakeets — green parrots in village farms
- Egrets — white birds following farmers in fields
Best time: Early morning (6–9 AM) for maximum sightings!""",

    "contact": """📞 Contact AgroVista:
- Email: support@agrovista.com
- Phone: +91 98765 43210
- Location: Rural India Network
- Working hours: 9 AM – 6 PM IST
- Response time: Within 24 hours
For urgent booking queries, call us directly!""",

    "culture": """🎭 Indian Agricultural Culture:
- India has 5000+ years of farming heritage
- 28 states with unique farming traditions
- Each region has distinct harvest festivals
- Traditional farming tools still used in villages
- Rural artisans create farm-based handicrafts
- Agricultural universities preserve farming knowledge
Experience this rich culture firsthand at our farm stays!""",

    "weather": """🌤️ Best Travel Seasons for Agrotourism:
- ❄️ Winter (Oct–Feb) — Best season, cool & pleasant
- 🌸 Spring (Feb–Apr) — Harvest festivals & blooming farms
- ☀️ Summer (Apr–Jun) — Hot but good for North India farms
- 🌧️ Monsoon (Jun–Sep) — Green & lush, some farms accessible
We recommend October to March for the best experience!""",

    "organic": """🌿 Organic Farming in India:
- India is world's largest organic producer by farmer count
- 2.78 million organic farmers across India
- Sikkim — world's first fully organic state
- Key organic crops: spices, tea, coffee, fruits
- Benefits: healthier produce, eco-friendly, supports farmers
- Certification: India Organic, NPOP standards
Learn organic techniques hands-on at our farm stays!""",
}


# ================= FALLBACK FUNCTION =================
def get_fallback(message: str) -> str:
    message_lower = message.lower()

    # Check each keyword
    for keyword, response in FALLBACK_RESPONSES.items():
        if keyword in message_lower:
            return response

    # Default fallback
    return """🌿 I'm AgroVista AI Assistant! I can help you with:
- 🗺️ Agrotourism destinations across India
- 🌱 Plant disease detection & farming tips
- 🎉 Indian harvest festivals & culture
- 📦 Tour packages & booking guidance
- 🐦 Bird watching & farm activities
- 🌾 Organic farming practices

What would you like to know? Ask me anything! 😊"""

import time

def call_with_retry(client, model, config, contents, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.models.generate_content(
                model=model,
                config=config,
                contents=contents
            )
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                wait = (attempt + 1) * 10  # wait 10s, 20s, 30s
                print(f"Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            raise e

# ================= MAIN CHAT FUNCTION =================

async def chat_with_gemini(message: str, history: list):
    try:
        contents = []

        # Build conversation history
        for msg in history:
            role = msg.get("role", "user")
            text = msg.get("text", "")

            # Gemini only accepts "user" or "model"
            if role not in ["user", "model"]:
                role = "user"

            # Skip empty messages
            if not text.strip():
                continue

            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=text)]
                )
            )

        # Add current user message
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part(text=message)]
            )
        )

        print("Sending to Gemini:", message)
        print("History length:", len(contents))

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=500,
            ),
            contents=contents
        )

        print("Gemini reply received ✅")

        return {
            "reply": response.text,
            "status": "success"
        }

    except Exception as e:
        error_str = str(e)
        print("CHATBOT ERROR:", error_str)

        # ================= ERROR HANDLING =================

        # Quota exceeded
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            print("⚠️ Quota exceeded — using fallback")
            return {
                "reply": get_fallback(message),
                "status": "fallback",
                "note": "AI quota exceeded, showing cached response"
            }

        # Model not found
        elif "404" in error_str or "NOT_FOUND" in error_str:
            print("⚠️ Model not found — using fallback")
            return {
                "reply": get_fallback(message),
                "status": "fallback",
                "note": "AI model unavailable, showing cached response"
            }

        # Auth error
        elif "403" in error_str or "PERMISSION_DENIED" in error_str:
            print("⚠️ Auth error — using fallback")
            return {
                "reply": get_fallback(message),
                "status": "fallback",
                "note": "AI auth error, showing cached response"
            }

        # Network / timeout
        elif "503" in error_str or "UNAVAILABLE" in error_str:
            print("⚠️ Service unavailable — using fallback")
            return {
                "reply": get_fallback(message),
                "status": "fallback",
                "note": "AI service unavailable, showing cached response"
            }

        # Any other error
        else:
            print("⚠️ Unknown error — using fallback")
            return {
                "reply": get_fallback(message),
                "status": "fallback",
                "details": error_str
            }
