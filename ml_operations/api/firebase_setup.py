# firebase_config.py
import os
import json
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK using environment variables"""
    if firebase_admin._apps:
        return firestore.client()
    
    # Get Firebase config from environment variables
    firebase_config = {
        "type": "service_account",
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
        "universe_domain": "googleapis.com"
    }
    
    # Validate required fields
    required_fields = ["project_id", "private_key", "client_email"]
    for field in required_fields:
        if not firebase_config.get(field):
            raise ValueError(f"Missing required Firebase environment variable: FIREBASE_{field.upper()}")
    
    # Initialize Firebase
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)
    
    return firestore.client()

# Initialize Firebase and export db
db = initialize_firebase()

__all__ = ['db']
