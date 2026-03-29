# ET Navigator

ET Navigator is an AI-powered platform that helps users discover and navigate different services within the Economic Times ecosystem, including ET Prime, Markets, Masterclasses, and Events.

---

## Problem

Economic Times offers multiple services, but users often don’t know what is relevant to them. This leads to poor discovery and low engagement.

---

## Solution

ET Navigator uses a chat-based onboarding system to understand the user and recommend relevant and personalized content across different ET sections.

---

## Features

- Chat-based user onboarding  
- User profile generation  
- Personalized recommendations  
- Section-based browsing (Insights, Markets, Learn, Events)  
- Dynamic updates based on user profile  

---

## Tech Stack

Frontend:
- React
- Tailwind CSS
- React Router

Backend:
- Flask (Python)

Database:
- Firebase Firestore

AI:
- Gemini API (optional)

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Vedant-SB/ET-Gen-AI-Hackathon

cd ET-Gen-AI-Hackathon
```

### 2. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 4. Environment Variables

Create a `.env` file in the backend folder and add required keys (Firebase, Gemini if used).

Make sure both frontend and backend are running simultaneously.

## Project Structure
- /frontend – React application
- /backend – Flask server
- /data – Static dataset