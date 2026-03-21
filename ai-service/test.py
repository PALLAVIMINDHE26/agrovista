from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

key = os.getenv("GEMINI_API_KEY")
print("KEY FOUND:", key)

from google import genai

client = genai.Client(api_key=key)

response = client.models.generate_content(
    model="models/gemini-2.5-flash",
    contents="Say hello"
)

print("RESPONSE:", response.text)