from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd 
import numpy as np 
from fastapi.middleware.cors import CORSMiddleware

class Symptoms(BaseModel):
    symptoms: list[str]

app = FastAPI()

origin = 'http://localhost:3000'

# add cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load the model and data and encoder 
model,le = joblib.load('/Users/jroyarekhua/SymptomCheckerHackthon/ml_operations/models/baseline_lrg.pkl')
print('model loaded')

data = pd.read_csv('/Users/jroyarekhua/SymptomCheckerHackthon/ml_operations/data/clean/encoded_data2.csv')

# get the data from the columns 
model_symptoms = data.columns.to_list()
model_symptoms.remove('disease')


@app.get("/predict") 
async def Root():
    return {'message': 'hello world'}



# should take a list of symproms, encode them and save them to the database 
@app.post('/predict',status_code=200)
async def post_predictions(Symptoms: Symptoms):
    if not Symptoms.symptoms:
        raise HTTPException(status_code=404, detail='no symptoms provided')
    
    
    try:
        encoded = encode(Symptoms.symptoms)
        prediction = model.predict(encoded) # most likely class index
        proba = model.predict_proba(encoded) # confidence level of each class
        confidence = float(max(proba[0]))
        decoded = le.inverse_transform(prediction) # map index back to correct label
    except Exception as e:
        raise HTTPException(status_code=500,detail=f'internal server error {e}')
    return {'prediction' : decoded[0],
            'confidence' : confidence
            }

@app.get('/symptoms',status_code=200)
async def getSymptoms():
    print('route hit')
    return {'symptoms': model_symptoms}
   


# takes the input and encodes the data into 1s and 0s based on the input 
def encode(input: list[str]):
    input_norm = [symptom.lower() for symptom in input]
    features = [1 if symptom.lower() in input_norm else 0 for symptom in model_symptoms]
    return pd.DataFrame([features], columns=model_symptoms)