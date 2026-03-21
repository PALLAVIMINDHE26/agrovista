from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model.plant import predict_disease

app = FastAPI()

# Allow frontend access
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