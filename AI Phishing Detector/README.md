🛡️ AI Phishing Detection System
Real-time Email & URL Threat Detection using Deep Learning + Modern UI Dashboard

The AI Phishing Detection System is a full-stack application that detects phishing threats in emails and URLs.
It uses a hybrid ML+DL pipeline combining:

Convolutional Neural Networks (CNN)

TF-IDF Features

Canopy-selected features

K-Nearest Neighbors (KNN)

URL heuristic feature extraction

Ensemble weighted scoring

The system provides real-time results through a Figma-inspired dark UI dashboard built using React, TypeScript, Tailwind, and Vite.

📸 Screenshots
🔹 Dashboard Overview

🔹 URL Phishing Detection

🔹 URL Scan History

🔹 Email Phishing Detection

✨ Features
🔍 AI-powered Detection

URL phishing detection using:

Feature extraction (length, digits, HTTPS, subdomains, IP, suspicious keywords)

Scaler → CNN → KNN → Ensemble score

Email phishing detection using:

Clean text → TF-IDF → Selected features → CNN → KNN ensemble

Detailed reasoning & suspicious pattern extraction

Confidence scoring (0–100%)

🖥️ Modern Dashboard UI

Dark theme (Figma-style)

Real-time result panel

Auto-updating scan history with timestamps

Highlighted phishing and safe badges (red/green)

Smooth layout with professional spacing

📊 Stats Overview

Total scans

Threats detected

Safe items

Average confidence

🧠 Tech Stack
Backend

Python

Flask

Flask-CORS

TensorFlow

Scikit-Learn

Joblib

NumPy / Pandas

Frontend

React (TypeScript)

Vite

TailwindCSS

ShadCN Components

Custom Figma-based design

📁 Project Structure
AI Phishing Detector/
│
├── Photos/                                   # README screenshots
│
├── backend/
│   ├── Dataset/                               # Optional dataset
│   ├── models/                                # All ML models
│   │   ├── cnn_model_final.h5
│   │   ├── cnn_feature_extractor.h5
│   │   ├── knn_classifier.pkl
│   │   ├── knn_model.joblib
│   │   ├── tfidf_vectorizer.pkl
│   │   ├── canopy_selected_features.npy
│   │   ├── scaler.joblib
│   │   └── ensemble_meta.json
│   ├── app.py                                 # Flask server
│   └── requirements.txt                       # Backend deps
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── guidelines/
│   │   ├── styles/
│   │   ├── App.tsx                            # Main UI
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── Attributions.md
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

⚙️ Installation & Setup
🔧 Backend Setup (Flask API)
1. Install dependencies
cd backend
pip install -r requirements.txt

2. Run the backend
python app.py


Backend will run on:

http://127.0.0.1:5000

💻 Frontend Setup (React + Vite + Tailwind)
1. Install dependencies
cd frontend
npm install

2. Run the frontend
npm run dev


Frontend will start at:

http://localhost:5173

🔗 API Endpoint
POST /predict
📌 URL Example
{
  "url": "http://free-gift-card.tinyurl.com/winner"
}

📌 Email Example
{
  "email": "Verify your account at http://secure-bank.tk"
}

Sample Response
{
  "type": "url",
  "label": "phishing",
  "confidence": "80.25%",
  "details": {
    "cnn": 0.72,
    "knn": 0.67
  },
  "reason": "Suspicious URL keyword detected: tinyurl",
  "timestamp": "2025-11-14 23:00:01"
}

🧪 Testing Examples
✔️ URLs
http://free-gift-card.tinyurl.com/winner
https://www.wikipedia.org/wiki/OpenAI
http://192.168.0.10/login

✔️ Emails
Subject: Update your password now  
We detected unusual login attempts on your account.

🚀 Future Enhancements

Deploy backend to Render/Railway

Deploy frontend to Vercel

Add database logging (MongoDB/Firebase)

Add analytics charts to the dashboard

Add user login & role system

Multi-language phishing detection

⭐ Acknowledgements

TensorFlow

Scikit-Learn

React + Tailwind

Figma Design Inspiration

ShadCN Components

👨‍💻 Author

Ruturaj Narvekar
AI/ML Developer • Full-Stack Engineer
