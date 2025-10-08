import firebase_admin
from firebase_admin import credentials,firestore
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Get the path to the Firebase credentials from the environment variable
FIREBASE_CRED = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
print(FIREBASE_CRED)
# Print the value to verify it's being loaded correctly


# Ensure that the path is valid
if FIREBASE_CRED:
    # Initialize Firebase with the credentials
    cred = credentials.Certificate('/Users/jroyarekhua/Desktop/medifyAccountKey.json')
    firebase_admin.initialize_app(cred)
    print("Firebase initialized successfully!")
else:
    print("Error: GOOGLE_APPLICATION_CREDENTIALS is not set correctly.")

db = firestore.client()

__all__ = ['db']