from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os
from firebase_service import save_chat

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

SYSTEM_PROMPT = """You are the ET AI Concierge — a friendly, knowledgeable guide to the Economic Times ecosystem.

Your role is to understand the user through natural conversation and help them discover relevant ET services they might benefit from.

ET Ecosystem includes:
- ET Prime: Premium journalism, in-depth analysis, expert columns
- ET Markets: Stock quotes, market news, portfolio tracking, technical analysis
- ET Wealth: Personal finance, tax planning, investment advice
- ET Masterclasses: Online courses on finance, leadership, business skills
- ET Events: Conferences, summits, networking events
- ET Now: Business news TV channel and live streaming
- Brand Equity: Marketing and advertising news
- ET Auto, ET Retail, ET Telecom, ET Energy, ET Infra: Industry verticals
- ET Crypto: Cryptocurrency news and analysis

Conversation Guidelines:
1. Ask ONE question at a time — never multiple questions
2. Be conversational, not robotic or form-like
3. Show genuine curiosity about the user
4. Based on responses, naturally weave in relevant ET service suggestions
5. Don't just profile — actively guide users to explore new areas
6. Be slightly proactive: "Based on what you mentioned, you might find X interesting..."
7. Keep responses concise but warm

Things to understand about the user (gradually, not all at once):
- Profession/industry
- Interests (markets, news, learning, crypto, business, etc.)
- Financial goals (optional — don't push if they're uncomfortable)
- Experience level with finance/investing
- What they're curious to explore

Start by greeting warmly and asking an engaging opening question."""


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

        Continue the conversation naturally.
        Ask ONE question at a time.
        IMPORTANT:
        - Keep response short (2–3 lines max)
        - Do NOT give long explanations
        - Focus on understanding the user
        - Ask ONE question at a time
        """

        response = model.generate_content(prompt)
        
        if hasattr(response, "text") and response.text:
            return response.text
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
        
        reply = get_ai_response(user_message, history)

        # ✅ SAVE CHAT HERE (CORRECT PLACE)
        save_chat("test_user", history + [{"role": "assistant", "content": reply}])
        
        return jsonify({"reply": reply})
    
    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Testing Gemini...")
    print(get_ai_response("Say hello"))
    
    app.run(debug=True, port=5000)