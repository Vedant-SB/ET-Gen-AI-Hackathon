import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def save_chat_message(user_id, messages):
    """
    Append messages to chats/{user_id}/history using ArrayUnion.
    Creates the document if it doesn't exist.
    
    Args:
        user_id: UUID string
        messages: List of message objects [{role, content}, ...]
    """
    doc_ref = db.collection("chats").document(user_id)
    doc = doc_ref.get()
    
    if doc.exists:
        # Append to existing history using ArrayUnion
        doc_ref.update({
            "history": firestore.ArrayUnion(messages),
            "updated_at": datetime.utcnow()
        })
    else:
        # Create new chat document
        doc_ref.set({
            "history": messages,
            "updated_at": datetime.utcnow()
        })


def get_chat(user_id):
    """Get chat history for a user."""
    doc = db.collection("chats").document(user_id).get()
    if doc.exists:
        data = doc.to_dict()
        return data.get("history", [])
    return []


def save_profile(user_id, profile):
    """
    Save user profile to users/{user_id}.
    Ensures domain and interests are arrays.
    """
    # Ensure domain is an array
    if "domain" in profile and isinstance(profile["domain"], str):
        profile["domain"] = [profile["domain"]] if profile["domain"] else []
    
    # Ensure interests is an array
    if "interests" in profile and isinstance(profile["interests"], str):
        profile["interests"] = [s.strip() for s in profile["interests"].split(",") if s.strip()]
    
    # Ensure goals is an array
    if "goals" in profile and isinstance(profile["goals"], str):
        profile["goals"] = [s.strip() for s in profile["goals"].split(",") if s.strip()]
    
    profile["created_at"] = datetime.utcnow()
    
    db.collection("users").document(user_id).set(profile)
    return profile


def get_profile(user_id):
    """Get user profile from Firebase."""
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        return doc.to_dict()
    return None


def user_exists(user_id):
    """Check if a user document exists."""
    doc = db.collection("users").document(user_id).get()
    return doc.exists


def update_profile(user_id, profile_updates):
    """Update user profile in Firebase using merge to preserve existing data."""
    doc_ref = db.collection("users").document(user_id)
    
    # Ensure domain is an array
    if "domain" in profile_updates and isinstance(profile_updates["domain"], str):
        profile_updates["domain"] = [profile_updates["domain"]] if profile_updates["domain"] else []
    
    # Ensure interests is an array
    if "interests" in profile_updates and isinstance(profile_updates["interests"], str):
        profile_updates["interests"] = [s.strip() for s in profile_updates["interests"].split(",") if s.strip()]
    
    # Ensure goals is an array if present
    if "goals" in profile_updates and isinstance(profile_updates["goals"], str):
        profile_updates["goals"] = [s.strip() for s in profile_updates["goals"].split(",") if s.strip()]
    
    # Add updated timestamp
    profile_updates["updated_at"] = datetime.utcnow()
    
    # Use set with merge=True to update without overwriting other fields
    doc_ref.set(profile_updates, merge=True)
    
    # Return the full updated document
    updated_doc = doc_ref.get()
    return updated_doc.to_dict() if updated_doc.exists else profile_updates