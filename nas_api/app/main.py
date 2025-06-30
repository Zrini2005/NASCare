# app/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
from app.predict import predict_image

app = FastAPI()

# --- CORS Middleware Configuration ---
# This is required to allow your React frontend to make requests to this backend.
# For development, we allow the default React port (3000).
# In production, you would change "http://localhost:3000" to your deployed frontend's URL.

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))
    label = predict_image(image)
    return {"predicted_class": label}
