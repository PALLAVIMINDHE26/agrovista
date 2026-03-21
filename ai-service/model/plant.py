from google import genai
from google.genai import types
import os
import base64
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

key = os.getenv("GEMINI_KEY_DISEASE")
client = genai.Client(api_key=key)

async def predict_disease(file):
    image_bytes = await file.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",  # ✅ higher quota
            contents=[
                types.Content(
                    parts=[
                        types.Part(
                            inline_data=types.Blob(
                                mime_type="image/jpeg",
                                data=image_base64
                            )
                        ),
                        types.Part(
                        text="""You are a plant disease expert. Analyze this plant image and return ONLY a JSON response with no extra text:
{
    "plant_name": "name of the plant e.g. Tomato, Rose, Wheat",
    "disease": "disease name or Healthy",
    "confidence": 95,
    "severity": "Low / Medium / High",
    "description": "brief description of the disease",
    "treatment": "brief treatment recommendation"
}"""
                        )
                    ]
                )
            ]
        )

        import json
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)
        return result

    except Exception as e:
        return {"error": str(e)}