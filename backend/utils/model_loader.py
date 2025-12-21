import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "leak_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.pkl")

_model = None
_scaler = None

def load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model

def load_scaler():
    global _scaler
    if os.path.exists(SCALER_PATH):
        if _scaler is None:
            _scaler = joblib.load(SCALER_PATH)
        return _scaler
    return None
