from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json
import re
from firebase_service import save_chat, save_profile, get_profile, update_profile

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

SYSTEM_PROMPT = """You are an AI onboarding assistant for ET Navigator.

Your ONLY goal is to collect structured user data in a few steps and then stop.

STRICT RULES:
- Ask ONLY ONE question at a time
- Keep responses short (1–2 lines max)
- Do NOT ask vague or open-ended questions
- Do NOT explore randomly
- Stop once enough data is collected

FIELDS TO COLLECT:
1. name
2. role (student / working professional / business owner / other)
3. domain (finance, tech, manufacturing, marketing, etc.)
4. interests (markets, business, technology, learning, crypto, etc.)
5. preference (quick updates OR deep insights)

FLOW:

Step 1:
Ask name → "What should I call you?"

Step 2:
Ask role:
"Which best describes you? Student, working professional, business owner, or something else?"

Step 3:
Ask domain:
"What field are you involved in or interested in? (e.g., finance, tech, manufacturing, marketing)"

Step 4:
Ask interests:
"What kind of updates do you want most? (Markets, Business, Industry Trends, Learning, Crypto, etc.)"

Step 5:
Ask preference:
"Do you prefer quick updates or deep insights?"

After this:
Respond ONLY with:
"Got it! I’ve set things up for you. Click below to generate your experience."

IMPORTANT:
You are NOT a chatbot.
You are a structured onboarding system.
"""

# ET Products for recommendations
ET_PRODUCTS = [
    {
        "id": "prime",
        "title": "ET Prime",
        "description": "Premium journalism with in-depth analysis and expert columns.",
        "keywords": ["deep", "analysis", "premium", "insights", "business"]
    },
    {
        "id": "markets",
        "title": "ET Markets",
        "description": "Real-time stock quotes, market news, and portfolio tracking.",
        "keywords": ["market", "stock", "trading", "invest", "finance"]
    },
    {
        "id": "masterclass",
        "title": "ET Masterclass",
        "description": "Online courses on finance, leadership, and business skills.",
        "keywords": ["learning", "course", "education", "skill", "student"]
    },
    {
        "id": "wealth",
        "title": "ET Wealth",
        "description": "Personal finance guidance and smart investment advice.",
        "keywords": ["wealth", "finance", "money", "tax", "investment"]
    },
    {
        "id": "tech",
        "title": "ET Tech",
        "description": "Latest technology news, startups, and digital transformation.",
        "keywords": ["technology", "tech", "startup", "digital", "crypto"]
    },
    {
        "id": "auto",
        "title": "ET Auto",
        "description": "Automotive industry news, reviews, and trends.",
        "keywords": ["auto", "vehicle", "manufacturing", "ev", "automobile"]
    }
]


def extract_user_profile(conversation_history):
    """Use Gemini to extract structured profile from conversation."""
    try:
        conversation_text = ""
        for msg in conversation_history:
            role = "User" if msg["role"] == "user" else "Assistant"
            conversation_text += f"{role}: {msg['content']}\n"

        prompt = f"""Extract user profile from this onboarding conversation.
Return ONLY valid JSON, nothing else.

Conversation:
{conversation_text}

Extract these fields:
- name: string (user's name)
- role: string (student/working professional/business owner/other)
- domain: string (their field/industry)
- interests: array of keywords (max 5-6 items, short keywords only)
- goals: array of strings (optional, can be empty)
- preference: string (quick updates OR deep insights)

IMPORTANT:
- interests must be SHORT KEYWORDS, not sentences
- Return ONLY the JSON object, no markdown, no explanation

Example output:
{{"name": "John", "role": "Working Professional", "domain": "Technology", "interests": ["markets", "tech", "crypto"], "goals": ["learn investing"], "preference": "quick updates"}}
"""

        response = model.generate_content(prompt)
        
        if hasattr(response, "text") and response.text:
            text = response.text.strip()
            # Remove markdown code blocks if present
            text = re.sub(r'^```json\s*', '', text)
            text = re.sub(r'\s*```$', '', text)
            text = text.strip()
            
            profile = json.loads(text)
            return profile
        return None
    except Exception as e:
        print(f"🔥 Profile extraction error: {e}")
        return None


def get_rule_based_recommendations(profile):
    """Generate recommendations based on profile using simple rules."""
    if not profile:
        return ET_PRODUCTS[:4]
    
    user_text = ""
    if profile.get("interests"):
        if isinstance(profile["interests"], list):
            user_text += " ".join(profile["interests"])
        else:
            user_text += str(profile["interests"])
    
    if profile.get("domain"):
        user_text += " " + profile["domain"]
    
    if profile.get("preference"):
        user_text += " " + profile["preference"]
    
    if profile.get("role"):
        user_text += " " + profile["role"]
    
    user_text = user_text.lower()
    
    # Score each product
    scored = []
    for product in ET_PRODUCTS:
        score = sum(1 for kw in product["keywords"] if kw in user_text)
        scored.append((score, product))
    
    # Sort by score descending
    scored.sort(key=lambda x: x[0], reverse=True)
    
    # Return top 4 or all if less matches
    recommendations = [p for _, p in scored if _ > 0]
    if len(recommendations) < 2:
        recommendations = ET_PRODUCTS[:4]
    
    return recommendations[:4]


def get_ai_response(user_message, conversation_history=None):
    try:
        conversation = ""

        if conversation_history:
            for msg in conversation_history:
                role = "User" if msg["role"] == "user" else "Assistant"
                conversation += f"{role}: {msg['content']}\n"

        conversation += f"User: {user_message}\n"

        prompt = f"""
{SYSTEM_PROMPT}

Conversation so far:
{conversation}

Follow the onboarding flow strictly.
Do NOT behave like a free conversation.
Ask ONLY ONE question at a time.
Stop when enough data is collected.

IMPORTANT:
- Keep response short (1–2 lines max)
- Do NOT give long explanations
"""

        response = model.generate_content(prompt)

        if hasattr(response, "text") and response.text:
            return response.text.strip()
        else:
            return "No response from AI"

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return "Error occurred"


@app.route("/")
def home():
    return "ET AI Concierge Backend is running"


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"error": "Message is required"}), 400

        user_message = data["message"].strip()

        if not user_message:
            return jsonify({"error": "Message cannot be empty"}), 400

        history = data.get("history", [])

        # LIMIT CONVERSATION (prevents endless chat)
        if len(history) >= 10:
            reply = "Got it! I’ve set things up for you. Click below to generate your experience."
        else:
            reply = get_ai_response(user_message, history)

        # Save BOTH user + assistant messages
        updated_history = history + [
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": reply}
        ]

        save_chat("test_user", updated_history)

        user_id = data.get("user_id", "test_user")
        
        # If onboarding complete, extract and save profile
        if "generate your experience" in reply.lower():
            profile = extract_user_profile(updated_history)
            if profile:
                save_profile(user_id, profile)
                return jsonify({"reply": reply, "profile": profile})

        return jsonify({"reply": reply})

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/profile/<user_id>", methods=["GET"])
def get_user_profile(user_id):
    """Get user profile from Firebase."""
    try:
        profile = get_profile(user_id)
        if profile:
            return jsonify(profile)
        return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/profile/<user_id>", methods=["POST"])
def update_user_profile(user_id):
    """Update user profile in Firebase."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Profile data is required"}), 400
        
        updated = update_profile(user_id, data)
        return jsonify(updated)
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/recommendations", methods=["POST"])
def get_recommendations():
    """Get rule-based recommendations for a user."""
    try:
        data = request.get_json()
        user_id = data.get("user_id", "test_user")
        
        profile = get_profile(user_id)
        recommendations = get_rule_based_recommendations(profile)
        
        # Format response
        result = [{
            "title": r["title"],
            "description": r["description"]
        } for r in recommendations]
        
        return jsonify(result)
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Testing Gemini...")
    print(get_ai_response("Say hello"))

    app.run(debug=True, port=5000)