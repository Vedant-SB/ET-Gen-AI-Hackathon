import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def save_chat(user_id, history):
    db.collection("chats").add({
        "user_id": user_id,
        "history": history
    })


def save_profile(user_id, profile):
    """Save user profile to Firebase."""
    db.collection("users").document(user_id).set(profile)


def get_profile(user_id):
    """Get user profile from Firebase."""
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    return None


def update_profile(user_id, profile_updates):
    """Update user profile in Firebase."""
    doc_ref = db.collection("users").document(user_id)
    doc = doc_ref.get()
    
    if doc.exists:
        # Merge with existing profile
        doc_ref.update(profile_updates)
        return {**doc.to_dict(), **profile_updates}
    else:
        # Create new profile
        doc_ref.set(profile_updates)
        return profile_updates