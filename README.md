# AI Phishing Detection System  
**Real-time Email & URL Threat Detection with Deep Learning + Modern Dashboard**

A **production-ready**, **full-stack** phishing detection platform that combines **hybrid ML/DL pipelines** with a **sleek, Figma-inspired dark UI**. Detects phishing in **emails** and **URLs** in real time with **confidence scoring**, **explainable reasoning**, and **scan history**.

---

## 📸 Screenshots

| Dashboard Overview | URL Detection | Email Detection | Scan History |
|---------------------|---------------|------------------|-------------|
| ![Dashboard](/AI%20Phishing%20Detector/Photos/dashboard-overview.png) | ![URL](/AI%20Phishing%20Detector/Photos/url-detection.png) | ![Email](/AI%20Phishing%20Detector/Photos/email-detection.png) | ![History](/AI%20Phishing%20Detector/Photos/scan-history.png) |

---

## ✨ Key Features

### 🔍 **AI-Powered Threat Detection**
- **URL Phishing Detection**
  - Heuristic features: length, digits, HTTPS, subdomains, IP presence, suspicious keywords
  - Pipeline: `Scaler → CNN → KNN → Weighted Ensemble`
- **Email Phishing Detection**
  - Text preprocessing + TF-IDF vectorization
  - Canopy-selected high-impact features
  - Pipeline: `TF-IDF → CNN → KNN → Ensemble Score`
- **Explainable AI**
  - Confidence score: `0–100%`
  - Detailed model breakdown (CNN vs KNN)
  - Suspicious pattern highlighting
- **Real-time Results**
  - Instant feedback with **red/green badges**
  - Auto-updating scan history with timestamps

### 🖥️ **Modern Dashboard (Figma-Inspired)**
- **Dark theme** with professional spacing & typography
- Built with **React + TypeScript + TailwindCSS + ShadCN**
- Responsive & smooth animations
- Real-time result panel
- Scan history with filtering & export

### **Analytics Overview**
| Metric | Description |
|-------|-------------|
| Total Scans | All processed items |
| Threats Detected | Phishing confidence > 60% |
| Safe Items | Confidence < 40% |
| Avg. Confidence | Across all scans |

---

## 🧠 Tech Stack

| Layer | Technologies |
|------|--------------|
| **Backend** | Python, Flask, Flask-CORS, TensorFlow, Scikit-Learn, Joblib, NumPy, Pandas |
| **Frontend** | React (TypeScript), Vite, TailwindCSS, ShadCN UI, Lucide Icons |
| **ML Models** | CNN (`*.h5`), KNN (`*.pkl` / `*.joblib`), TF-IDF, Scaler, Ensemble Weights |
| **Design** | Figma-inspired UI, Dark Mode, Responsive Grid |

---

## 📁 Project Structure

```bash
AI-Phishing-Detector/
│
├── Photos/                          # Screenshots for README
├── backend/
│   ├── Dataset/                     # (Optional) Training data
│   ├── models/                      # Pre-trained models
│   │   ├── cnn_model_final.h5
│   │   ├── cnn_feature_extractor.h5
│   │   ├── knn_classifier.pkl
│   │   ├── knn_model.joblib
│   │   ├── tfidf_vectorizer.pkl
│   │   ├── canopy_selected_features.npy
│   │   ├── scaler.joblib
│   │   └── ensemble_meta.json
│   ├── app.py                       # Flask API server
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI
│   │   ├── pages/                   # Dashboard, URL, Email views
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # API utils, types
│   │   ├── styles/                  # Tailwind config, globals
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── Attributions.md
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
