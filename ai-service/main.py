from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model.plant import predict_disease
from pydantic import BaseModel
from services.chatbot import chat_with_gemini
from services.recommendation import get_recommendations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}

@app.post("/detect-disease")
async def detect_disease(file: UploadFile = File(...)):
    result = await predict_disease(file)
    return result

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat(req: ChatRequest):
    result = await chat_with_gemini(req.message, req.history)
    return result

class RecommendRequest(BaseModel):
    groupType: str = ""
    budget: str = ""
    duration: str = ""
    interest: str = ""
    season: str = ""
    state: str = ""

@app.post("/recommend")
async def recommend(req: RecommendRequest):
    preferences = req.dict()
    result = await get_recommendations(preferences)
    return result
