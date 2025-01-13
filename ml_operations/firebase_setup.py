import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Get the path to the Firebase credentials from the environment variable
FIREBASE_CRED = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Print the value to verify it's being loaded correctly
print(FIREBASE_CRED)

# Ensure that the path is valid
if FIREBASE_CRED:
    # Initialize Firebase with the credentials
    cred = credentials.Certificate(FIREBASE_CRED)
    firebase_admin.initialize_app(cred)
    print("Firebase initialized successfully!")
else:
    print("Error: GOOGLE_APPLICATION_CREDENTIALS is not set correctly.")

