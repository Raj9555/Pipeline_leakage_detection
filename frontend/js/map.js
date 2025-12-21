// ================= GLOBAL VARIABLES =================
let map;
let pipeLines = {};          // location_code -> polyline
let activeLine = null;      // currently highlighted pipe
let highlightedMarker = null;

// ================= INIT MAP =================
function initMap() {
    map = L.map("map").setView([25.2048, 55.2708], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    loadWireframe();
}

// ================= LOAD WIREFRAME =================
function loadWireframe() {
    fetch("http://127.0.0.1:5000/api/wireframe")
        .then(res => res.json())
        .then(data => {
            const palette = [
                "#1f77b4", "#ff7f0e", "#2ca02c",
                "#d62728", "#9467bd", "#8c564b",
                "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
            ];

            data.forEach((link, index) => {
                const baseColor = palette[index % palette.length];

                const polyline = L.polyline(link.coords, {
                    color: baseColor,
                    weight: 4,
                    opacity: 0.9,
                    dashArray: "4 4",
                    lineCap: "round",
                    lineJoin: "round"
                }).addTo(map);

                // 🔑 Store by location_code so we can target one pipe later
                pipeLines[link.location_code] = {
                    line: polyline,
                    baseColor: baseColor
                };
            });
        })
        .catch(err => console.error("Wireframe load error:", err));
}

// ================= HIGHLIGHT ONLY ONE PIPE =================
function highlightSinglePipe(locationCode, level) {

    const colorMap = {
        green: "#28a745",
        blue: "#007bff",
        yellow: "#ffc107",
        red: "#dc3545"
    };

    // Reset previously highlighted pipe
    if (activeLine) {
        activeLine.line.setStyle({
            color: activeLine.baseColor,
            weight: 4,
            opacity: 0.9
        });
    }

    const target = pipeLines[locationCode];
    if (!target) {
        console.warn("Pipe not found for:", locationCode);
        return;
    }

    // Highlight only this pipe
    target.line.setStyle({
        color: colorMap[level],
        weight: 7,
        opacity: 1
    });

    activeLine = target;
}

// ================= ADD / UPDATE PIPE MARKER =================
function highlightPipe(lat, lng, info, level) {

    if (highlightedMarker) {
        map.removeLayer(highlightedMarker);
    }

    let colorMap = {
        green: "#28a745",
        blue: "#007bff",
        yellow: "#ffc107",
        red: "#dc3545"
    };

    let marker = L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: colorMap[level],
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);

    if (level === "red") {
        marker._path.classList.add("leak-pulse");
    }

    // ✅ Popup now shows exact coordinates of this marker
    marker.bindPopup(`
        <strong>Location:</strong> ${info.location_code}<br/>
        <strong>Latitude:</strong> ${Number(lat).toFixed(6)}<br/>
        <strong>Longitude:</strong> ${Number(lng).toFixed(6)}<br/>
        <strong>Status:</strong> ${info.status}<br/>
        <strong>Score:</strong> ${info.score}
    `).openPopup();

    highlightedMarker = marker;

    map.flyTo([lat, lng], 15, { duration: 1.2 });
}

// ================= AUTO INIT =================
document.addEventListener("DOMContentLoaded", initMap);
