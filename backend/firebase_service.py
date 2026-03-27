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
    db.collection("users").document(user_id).set(profile)