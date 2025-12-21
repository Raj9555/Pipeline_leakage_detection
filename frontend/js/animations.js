// ================= BUTTON LOADING ANIMATION =================
const checkBtn = document.getElementById("checkLeakBtn");

checkBtn.addEventListener("click", () => {
    startLoading();
    setTimeout(stopLoading, 900); // stops once backend responds normally
});

function startLoading() {
    checkBtn.disabled = true;
    checkBtn.innerText = "Checking...";
    checkBtn.style.opacity = "0.8";
}

function stopLoading() {
    checkBtn.disabled = false;
    checkBtn.innerText = "Check Leakage";
    checkBtn.style.opacity = "1";
}

// ================= RESULT CARD ANIMATION =================
const resultCard = document.getElementById("resultCard");

const observer = new MutationObserver(() => {
    if (!resultCard.classList.contains("hidden")) {
        resultCard.style.animation = "popIn 0.4s ease";
    }
});

observer.observe(resultCard, { attributes: true });

// ================= STATUS HIGHLIGHT EFFECT =================
function flashResult() {
    resultCard.style.boxShadow = "0 0 12px rgba(0,0,0,0.2)";
    setTimeout(() => {
        resultCard.style.boxShadow = "none";
    }, 600);
}

// Hook flash after prediction update
document.addEventListener("prediction-updated", flashResult);
