// ================= API CONFIG =================
const API_BASE = "http://127.0.0.1:5000/api";

// ================= EVENT LISTENER =================
document.getElementById("checkLeakBtn").addEventListener("click", () => {
    checkLeakage();
});

// ================= MAIN FUNCTION =================
function checkLeakage() {

    const locationCode = document.getElementById("location_code").value.trim();

    if (!locationCode) {
        alert("Please enter Location Code");
        return;
    }

    const sensorData = {
        Pressure: Number(document.getElementById("pressure").value),
        Flow_Rate: Number(document.getElementById("flow_rate").value),
        Temperature: Number(document.getElementById("temperature").value),
        Vibration: Number(document.getElementById("vibration").value),
        RPM: Number(document.getElementById("rpm").value),
        Operational_Hours: Number(document.getElementById("operational_hours").value)
    };

    // Basic validation
    for (let key in sensorData) {
        if (isNaN(sensorData[key])) {
            alert(`Please enter valid value for ${key}`);
            return;
        }
    }

    fetch(`${API_BASE}/check-leak`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            location_code: locationCode,
            sensor_data: sensorData
        })
    })
    .then(res => res.json())
    .then(data => {

        // ❌ backend error handling
        if (data.error) {
            alert(data.error);
            return;
        }

        updateResultCard(data);

        // 🔥 Highlight ONLY the selected pipe
        highlightSinglePipe(
            data.location_code,
            data.prediction.level
        );

        // 🗺️ Place marker at exact coordinates from backend
        highlightPipe(
            Number(data.latitude),
            Number(data.longitude),
            {
                location_code: data.location_code,
                status: data.prediction.status,
                score: data.prediction.anomaly_score
            },
            data.prediction.level
        );

        document.dispatchEvent(new Event("prediction-updated"));
    })
    .catch(err => {
        console.error(err);
        alert("Backend error – check console");
    });
}

// ================= UPDATE RESULT CARD =================
function updateResultCard(data) {
    const card = document.getElementById("resultCard");
    card.classList.remove("hidden");

    // Remove old status classes
    card.classList.remove(
        "status-green",
        "status-blue",
        "status-yellow",
        "status-red"
    );

    // Apply new status class
    card.classList.add(`status-${data.prediction.level}`);

    document.getElementById("statusText").innerText =
        data.prediction.status;

    document.getElementById("scoreText").innerText =
        data.prediction.anomaly_score;

    document.getElementById("zoneText").innerText = data.zone;
    document.getElementById("blockText").innerText = data.block;
    document.getElementById("pipeText").innerText = data.pipe;
}
