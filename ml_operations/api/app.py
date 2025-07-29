from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd 
import numpy as np 

class Symptoms(BaseModel):
    symptoms: list[str]

app = FastAPI()

# load the model and data and encoder 
model,le = joblib.load('/Users/jroyarekhua/SymptomCheckerHackthon/ml_operations/models/baseline_lrg.pkl')
print('model loaded')

data = pd.read_csv('/Users/jroyarekhua/SymptomCheckerHackthon/ml_operations/data/clean/encoded_data2.csv')

# get the data from the columns 
model_symptoms = data.columns.to_list()
model_symptoms.remove('disease')
print(model_symptoms)

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
        prediction = model.predict(encoded)
        decoded = le.inverse_transform(prediction)
    except Exception as e:
        raise HTTPException(status_code=500,detail=f'internal server error {e}')
    return {'predictions' : decoded[0] }
   


# takes the input and encodes the data into 1s and 0s based on the input 
def encode(input: list[str]):
    input_norm = [symptom.lower() for symptom in input]
    features = [1 if symptom.lower() in input_norm else 0 for symptom in model_symptoms]
    return pd.DataFrame([features], columns=model_symptoms)