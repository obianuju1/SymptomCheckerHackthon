from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate('/Users/obianujuenekebe/SymptomCheckerHackthon/ml_operations/medifyAccountKey.json')  # Replace with your key's path
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()


app = Flask(__name__)
CORS(app)
# Load the pre-trained model
model = pickle.load(open("Random Forest.pkl", "rb"))
with open('label_encoder.pkl', 'rb') as file:
    le = pickle.load(file)

# Define the list of expected feature names (make sure this list matches the training data features)
expected_features = [
    "swelling_joints", "muscle_weakness", "hip_joint_pain", "knee_pain", "slurred_speech", 
    "drying_and_tingling_lips", "extra_marital_contacts", "excessive_hunger", "swollen_extremeties", 
    "brittle_nails", "enlarged_thyroid", "puffy_face_and_eyes", "swollen_blood_vessels", "swollen_legs", 
    "prominent_veins_on_calf", "painful_walking", "neck_pain", "irritation_in_anus", "bloody_stool", 
    "pain_in_anal_region", "pain_during_bowel_movements", "fast_heart_rate", "stomach_bleeding", 
    "chest_pain", "stiff_neck", "pus_filled_pimples", "blood_in_sputum", "spinning_movements", 
    "history_of_alcohol_consumption", "receiving_unsterile_injections", "receiving_blood_transfusion", 
    "visual_disturbances", "lack_of_concentration", "rusty_sputum", "mucoid_sputum", "family_history", 
    "increased_appetite", "watering_from_eyes", "abnormal_menstruation", "belly_pain", "red_spots_over_body", 
    "altered_sensorium", "muscle_pain", "toxic_look_(typhos)", "internal_itching", "passage_of_gases", 
    "continuous_feel_of_urine", "bladder_discomfort", "loss_of_smell", "weakness_of_one_body_side", 
    "loss_of_balance", "movement_stiffness", "runny_nose", "weakness_in_limbs", "redness_of_eyes", 
    "red_sore_around_nose", "sunken_eyes", "sinus_pressure", "yellow_crust_ooze", "irregular_sugar_level", 
    "patches_in_throat", "prognosis", "weight_loss", "mood_swings", "cold_hands_and_feets", "weight_gain", 
    "burning_micturition", "muscle_wasting", "ulcers_on_tongue", "stomach_pain", "joint_pain", "continuous_sneezing", 
    "nodal_skin_eruptions", "skin_rash", "inflammatory_nails", "yellowish_skin", "high_fever", "small_dents_in_nails", 
    "throat_irritation", "blurred_and_distorted_vision", "swelled_lymph_nodes", "swelling_of_stomach", "fluid_overload", 
    "acute_liver_failure", "dark_urine", "yellowing_of_eyes", "yellow_urine", "mild_fever", "distention_of_abdomen", 
    "skin_peeling", "loss_of_appetite", "back_pain", "silver_like_dusting", "pain_behind_the_eyes", "abdominal_pain", 
    "foul_smell_of_urine", "weakness_in_limbs", "muscle_wasting", "blackheads", "dehydration", "shivering", "scurring", 
    "extra_marital_contacts", "spotting_urination", "weakness_of_one_body_side", "nodal_skin_eruptions", "ulcers_on_tongue", 
    "patches_in_throat", "pus_filled_pimples", "swollen_blood_vessels", "watering_from_eyes", "spinning_movements", 
    "sunken_eyes", "irritation_in_anus", "acute_liver_failure", "bladder_discomfort", "visual_disturbances", "skin_peeling", 
    "small_dents_in_nails", "yellow_urine", "inflammatory_nails", "swelling_of_stomach", "mucoid_sputum", 
    "distention_of_abdomen", "fluid_overload", "drying_and_tingling_lips", "pain_during_bowel_movements", 
    "lack_of_concentration", "pain_in_anal_region", "bloody_stool", "weight_gain", "history_of_alcohol_consumption", 
    "puffy_face_and_eyes", "internal_itching", "belly_pain", "yellow_crust_ooze", "anxiety", "red_sore_around_nose", 
    "altered_sensorium", "cold_hands_and_feets", "passage_of_gases", "toxic_look_(typhos)", "cramps", "bruising", 
    "irregular_sugar_level", "continuous_feel_of_urine", "blister", "swollen_legs", "prominent_veins_on_calf", 
    "silver_like_dusting", "unsteadiness", "redness_of_eyes", "sinus_pressure", "runny_nose", "loss_of_smell", 
    "blood_in_sputum", "enlarged_thyroid", "stomach_bleeding", "swollen_extremeties", "increased_appetite", "rusty_sputum", 
    "pain_behind_the_eyes", "throat_irritation", "brittle_nails", "coma", "receiving_unsterile_injections", 
    "receiving_blood_transfusion", "congestion", "polyuria", "slurred_speech", "palpitations", "burning_micturition", 
    "continuous_sneezing", "indigestion", "stomach_pain", "acidity", "obesity", "mood_swings", "family_history", 
    "neck_pain", "constipation", "back_pain", "painful_walking", "swelling_joints", "stiff_neck", "restlessness", 
    "depression", "muscle_weakness", "fast_heart_rate", "red_spots_over_body", "abnormal_menstruation", "dizziness", 
    "blurred_and_distorted_vision", "loss_of_balance", "swelled_lymph_nodes", "mild_fever", "phlegm", "breathlessness", 
    "weight_loss", "lethargy", "excessive_hunger", "irritability", "muscle_pain", "diarrhoea", "cough", "dark_urine", 
    "sweating", "itching", "joint_pain", "chest_pain", "malaise", "skin_rash", "chills", "yellowing_of_eyes", 
    "yellowish_skin", "abdominal_pain", "headache", "nausea", "loss_of_appetite", "high_fever", "vomiting", "fatigue"
]
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data as JSON
        data = request.get_json()
        print("Raw input data:", data)  # Debug input
        
        # Extract scalar values from lists
        valid_data = {key: value[0] if isinstance(value, list) and len(value) > 0 else value for key, value in data.items()}
        
        # Ensure all expected features are present
        filtered_data = {key: valid_data.get(key, 0) for key in expected_features}
        
        # Convert to DataFrame
        input_df = pd.DataFrame([filtered_data]).reindex(columns=expected_features, fill_value=0)
        print("Processed DataFrame:\n", input_df)  # Debug DataFrame

        # Make prediction
        prediction = model.predict(input_df)
        predicted_disease = le.inverse_transform(prediction)[0]

        # Store prediction in Firestore
        doc_ref = db.collection('predictions').add({
            'input_data': filtered_data,
            'predicted_disease': predicted_disease
        })

        # Return the prediction
        return jsonify({'prediction': predicted_disease})

    except Exception as e:
        print("Error:", str(e))  # Debug the error
        return jsonify({'error': str(e)})



if __name__ == '__main__':
    app.run(debug=True)
