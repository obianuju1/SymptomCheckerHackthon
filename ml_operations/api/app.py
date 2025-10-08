from datetime import datetime
from typing import Optional
import os

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .firebase_setup import initialize_firebase

# Load environment variables
load_dotenv()

# Initialize Firebase
db = initialize_firebase()

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

class Symptoms(BaseModel):
    symptoms: list[str]

class SymptomSave(BaseModel):
    user_id: str
    disease: str
    description: str
    precautions: list[str]
    date: str | None = None

app = FastAPI(
    title="MedifyAI API",
    description="Medical symptom checker API",
    version="1.0.0"
)

# CORS configuration
origin = os.getenv("CORS_ORIGIN", "http://localhost:3000")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model and data
model_path = os.getenv("MODEL_PATH", "models/baseline_lrg.pkl")
data_path = os.getenv("DATA_PATH", "data/clean/encoded_data2.csv")

model, le = joblib.load(model_path)
print('Model loaded')

data = pd.read_csv(data_path)
model_symptoms = [col.lower() for col in data.columns if col != 'disease']


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "environment": ENVIRONMENT,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    return {
        "message": "MedifyAI API is running",
        "environment": ENVIRONMENT,
        "version": "1.0.0"
    }


@app.post('/predict', status_code=200)
async def post_predictions(Symptoms: Symptoms):
    if not Symptoms.symptoms:
        raise HTTPException(status_code=404, detail='no symptoms provided')

    try:
        encoded = encode(Symptoms.symptoms)
        prediction = model.predict(encoded)
        proba = model.predict_proba(encoded)
        confidence = float(max(proba[0]))
        decoded = le.inverse_transform(prediction)

        # query Firestore
        doc_ref = db.collection('Diagnoses').where(
            'Disease_normalized', '==', decoded[0].replace('_', ' ').lower()
        )
        docs = doc_ref.get()
        if not docs:
            raise HTTPException(status_code=404, detail="Prediction not found in database")

        data = docs[0].to_dict()
        data['Confidence'] = round(confidence, 2)
    except Exception as e:
        error_message = f'internal server error {e}' if ENVIRONMENT == 'development' else 'internal server error'
        raise HTTPException(status_code=500, detail=error_message)

    return data


@app.get('/symptoms', status_code=200)
async def getSymptoms():
    return {'symptoms': model_symptoms}


def encode(input: list[str]):
    input_norm = [s.lower() for s in input]
    features = [1 if s in input_norm else 0 for s in model_symptoms]
    return pd.DataFrame([features], columns=model_symptoms)


@app.post("/user/prediction")
def save_prediction(Data: SymptomSave):
    try:
        date = Data.date or datetime.today().strftime("%Y-%m-%d")
        diagnosis_ref = db.collection("users").document(Data.user_id).collection("past_diagnoses")

        diagnosis_ref.add({
            "Disease": Data.disease.strip(),
            "Disease_normalized": Data.disease.strip().lower(),
            "Description": Data.description.strip(),
            "Precautions": [p.strip() for p in Data.precautions],
            "Date": date
        })

        return {"status": "success", "message": f"Prediction saved for user {Data.user_id}"}

    except Exception as e:
        error_message = f"Error saving prediction: {e}" if ENVIRONMENT == 'development' else "Error saving prediction"
        raise HTTPException(status_code=500, detail=error_message)


@app.get("/user/past_diagnoses")
def get_past_diagnoses(
        user_id: str,
        page_size: int = Query(5, ge=1, le=50),
        start_after: Optional[str] = None,
        disease_filter: Optional[str] = None
):
    try:
        collection_ref = db.collection("users").document(user_id).collection("past_diagnoses")
        query = collection_ref.order_by("Date")

        if disease_filter:
            query = query.where("Disease_normalized", "==", disease_filter.lower())

        if start_after:
            last_doc_ref = collection_ref.document(start_after).get()
            if not last_doc_ref.exists:
                raise HTTPException(status_code=404, detail="Cursor document not found")
            query = query.start_after(last_doc_ref)

        query = query.limit(page_size)
        docs = query.stream()

        results = []
        last_doc_id = None
        for doc in docs:
            data = doc.to_dict()
            data["_id"] = doc.id
            results.append(data)
            last_doc_id = doc.id

        return {
            "results": results,
            "next_cursor": last_doc_id
        }

    except Exception as e:
        error_message = f"Error fetching past diagnoses: {e}" if ENVIRONMENT == 'development' else "Error fetching past diagnoses"
        raise HTTPException(status_code=500, detail=error_message)


@app.delete("/user/past_diagnoses")
def delete_past_diagnoses(user_id: str):
    """
    Delete the entire past_diagnoses subcollection for a user.
    """
    try:
        collection_ref = db.collection("users").document(user_id).collection("past_diagnoses")
        docs = collection_ref.stream()

        deleted_count = 0
        for doc in docs:
            doc.reference.delete()
            deleted_count += 1

        return {
            "status": "success",
            "message": f"Deleted {deleted_count} predictions for user {user_id}"
        }

    except Exception as e:
        error_message = f"Error deleting predictions: {e}" if ENVIRONMENT == 'development' else "Error deleting predictions"
        raise HTTPException(status_code=500, detail=error_message)


@app.delete("/user/past_diagnoses/{doc_id}")
def delete_prediction(user_id: str, doc_id: str):
    """
    Delete a single prediction from a user's past_diagnoses subcollection.
    """
    try:
        doc_ref = db.collection("users").document(user_id).collection("past_diagnoses").document(doc_id)
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Prediction not found")

        doc_ref.delete()
        return {
            "status": "success",
            "message": f"Deleted prediction {doc_id} for user {user_id}"
        }

    except Exception as e:
        error_message = f"Error deleting prediction: {e}" if ENVIRONMENT == 'development' else "Error deleting prediction"
        raise HTTPException(status_code=500, detail=error_message)