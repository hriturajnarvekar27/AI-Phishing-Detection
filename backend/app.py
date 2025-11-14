from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import joblib
import numpy as np
import json
import os
from datetime import datetime
import re
from sklearn.preprocessing import StandardScaler

# ---------------- Flask Initialization ----------------
app = Flask(__name__)
CORS(app)  # Allow frontend (React/Vite) to access backend

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ---------------- Model Registry ----------------
models = {}

# Suspicious keywords (for heuristic reasoning)
SUSPICIOUS_WORDS = [
    "login", "verify", "update", "account", "password",
    "bank", "secure", "confirm", "free", "click", "urgent"
]


# ---------------- Text Cleaning ----------------
def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+", "", text)  # remove links
    text = re.sub(r"[^a-z\s]", "", text)  # remove symbols
    text = re.sub(r"\s+", " ", text).strip()
    return text


# ---------------- Model Loader ----------------
def load_models():
    """Lazy load all models once"""
    if models:
        return

    # ---- URL MODELS ----
    models["cnn_url"] = tf.keras.models.load_model(os.path.join(MODELS_DIR, "cnn_model_final.h5"))
    models["knn_url"] = joblib.load(os.path.join(MODELS_DIR, "knn_model.joblib"))
    models["scaler_url"] = joblib.load(os.path.join(MODELS_DIR, "scaler.joblib"))

    # Ensemble metadata
    with open(os.path.join(MODELS_DIR, "ensemble_meta.json"), "r") as f:
        models["ensemble_meta"] = json.load(f)

    # ---- EMAIL MODELS ----
    models["cnn_email"] = tf.keras.models.load_model(os.path.join(MODELS_DIR, "cnn_feature_extractor.h5"))
    models["knn_email"] = joblib.load(os.path.join(MODELS_DIR, "knn_classifier.pkl"))
    models["tfidf"] = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
    models["canopy_feats"] = np.load(os.path.join(MODELS_DIR, "canopy_selected_features.npy"))


# ---------------- Feature Extraction for URL ----------------
def extract_url_features(url):
    """Extract numeric & heuristic features from URLs"""
    features = {}
    features['length'] = len(url)
    features['num_digits'] = sum(c.isdigit() for c in url)
    features['num_special'] = len(re.findall(r'[^\w]', url))
    features['has_https'] = 1 if "https" in url else 0
    features['num_dots'] = url.count('.')
    features['contains_ip'] = 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', url) else 0
    features['has_at'] = 1 if '@' in url else 0
    features['suspicious_words'] = sum(word in url.lower() for word in SUSPICIOUS_WORDS)
    return np.array(list(features.values())).reshape(1, -1)


# ---------------- Prediction: URL ----------------
def predict_url(url: str):
    load_models()

    try:
        features = extract_url_features(url)
        features_scaled = models["scaler_url"].transform(features)

        # Model predictions
        cnn_pred = models["cnn_url"].predict(features_scaled, verbose=0)[0][0]
        knn_pred = models["knn_url"].predict_proba(features_scaled)[0][1]

        # Ensemble (weighted)
        meta = models["ensemble_meta"]
        final_score = meta["weights"]["cnn"] * cnn_pred + meta["weights"]["knn"] * knn_pred
        label = "phishing" if final_score > meta["threshold"] else "safe"

        reasons = []
        if label == "phishing":
            reasons.append("⚠️ Detected suspicious URL patterns.")
            for word in SUSPICIOUS_WORDS:
                if word in url.lower():
                    reasons.append(f"Contains keyword: '{word}'")
        else:
            reasons.append("✅ URL appears safe and trustworthy.")

        return {
            "type": "url",
            "label": label,
            "confidence": f"{final_score * 100:.2f}%",
            "details": {"cnn": cnn_pred, "knn": knn_pred},
            "reason": " ".join(reasons),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    except Exception as e:
        return {"label": "error", "reason": str(e)}


# ---------------- Prediction: Email ----------------
def predict_email(email_text: str):
    load_models()

    try:
        text = clean_text(email_text)
        tfidf_vec = models["tfidf"].transform([text]).toarray()

        # Select canopy features
        feats = models["canopy_feats"].astype(int)
        tfidf_selected = tfidf_vec[:, feats]

        # CNN input shape: (1, 50, 1)
        cnn_input = tfidf_selected.reshape(tfidf_selected.shape[0], tfidf_selected.shape[1], 1)
        cnn_pred = models["cnn_email"].predict(cnn_input, verbose=0)[0][0]

        # KNN classifier
        knn_pred = models["knn_email"].predict_proba(tfidf_selected)[0][1]

        final_score = (0.6 * cnn_pred) + (0.4 * knn_pred)
        label = "phishing" if final_score >= 0.5 else "safe"

        reasons = []
        if label == "phishing":
            reasons.append("⚠️ Phishing-like email detected.")
            bad_words = [w for w in SUSPICIOUS_WORDS if w in text]
            if bad_words:
                reasons.append(f"Suspicious words: {', '.join(bad_words[:3])}")
        else:
            reasons.append("✅ Email appears legitimate.")

        return {
            "type": "email",
            "label": label,
            "confidence": f"{final_score * 100:.2f}%",
            "details": {"cnn": cnn_pred, "knn": knn_pred},
            "reason": " ".join(reasons),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    except Exception as e:
        return {"label": "error", "reason": str(e)}


# ---------------- Flask Route ----------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"label": "error", "reason": "No input provided."})

        if "url" in data and data["url"]:
            return jsonify(predict_url(data["url"]))

        elif "email" in data and data["email"]:
            return jsonify(predict_email(data["email"]))

        else:
            return jsonify({"label": "error", "reason": "Please provide either 'email' or 'url'."})

    except Exception as e:
        return jsonify({"label": "error", "reason": str(e)})


# ---------------- Root ----------------
@app.route('/')
def home():
    return jsonify({
        "status": "running",
        "message": "AI Phishing Detection Backend Active",
        "endpoints": ["/predict"]
    })


# ---------------- Main ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
