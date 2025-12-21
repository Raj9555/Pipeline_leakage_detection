import numpy as np
from .model_loader import load_model, load_scaler

FEATURE_ORDER = [
    "Pressure",
    "Flow_Rate",
    "Temperature",
    "Vibration",
    "RPM",
    "Operational_Hours"
]

def predict_leak(input_data: dict):
    model = load_model()
    scaler = load_scaler()

    X = np.array([[input_data[f] for f in FEATURE_ORDER]])

    if scaler:
        X = scaler.transform(X)

    score = model.decision_function(X)[0]
    print("Min score:", score.min())
    print("Max score:", score.max())
    print("Mean score:", score.mean())

    # 🔥 FINAL THRESHOLD LOGIC
    if score >= 0.05:
        status = "No Leak"
        level = "green"
    elif score >= 0.00:
        status = "Normal"
        level = "blue"
    elif score >= -0.10:
        status = "Medium Risk"
        level = "yellow"
    else:
        status = "High Risk Leak"
        level = "red"

    return {
        "anomaly_score": round(float(score), 4),
        "status": status,
        "level": level
    }
