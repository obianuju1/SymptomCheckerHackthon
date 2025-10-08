from api.firebase_setup import db

# Reference your collection
diagnoses_ref = db.collection("Diagnoses")
docs = diagnoses_ref.stream()

for doc in docs:
    data = doc.to_dict()
    updates = {}

    # Normalize the 'Disease' field if it exists
    if "Disease" in data and isinstance(data["Disease"], str):
        normalized_disease = data["Disease"].strip().lower()
        updates["Disease_normalized"] = normalized_disease

    # Update the document if there are changes
    if updates:
        doc_ref = diagnoses_ref.document(doc.id)
        doc_ref.update(updates)
        print(f"Updated doc {doc.id}: {updates}")
