from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

from utils.predictor import predict_leak
from utils.wireframe import generate_wireframe

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "data", "pipe_locations.csv")

# Load pipe location data once
pipe_df = pd.read_csv(DATA_PATH)

# ================= WIREFRAME =================
@app.route("/api/wireframe", methods=["GET"])
def wireframe():
    connections = generate_wireframe(pipe_df)
    return jsonify(connections)

# ================= CHECK LEAK =================
@app.route("/api/check-leak", methods=["POST"])
def check_leak():
    data = request.json

    location_code = data.get("location_code")
    sensor_data = data.get("sensor_data")

    if not location_code or not sensor_data:
        return jsonify({"error": "Missing location_code or sensor_data"}), 400

    # 🔍 Find row safely
    row_df = pipe_df[pipe_df["Location_Code"] == location_code]

    if row_df.empty:
        return jsonify({"error": "Location code not found"}), 404

    row = row_df.iloc[0]

    # 🔮 Predict leakage
    prediction = predict_leak(sensor_data)

    response = {
        "location_code": location_code,
        "zone": row["Zone"],
        "block": row["Block"],
        "pipe": row["Pipe"],
        # ✅ exact coordinates from CSV
        "latitude": float(row["Latitude"]),
        "longitude": float(row["Longitude"]),
        "prediction": prediction
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
