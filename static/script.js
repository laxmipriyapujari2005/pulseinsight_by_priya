// --- LOGIN FUNCTION ---
function login() {
    const loginPage = document.getElementById('loginPage');
    const habitPage = document.getElementById('habitPage');

    if (!loginPage || !habitPage) {
        alert("Page elements missing!");
        return;
    }

    loginPage.style.display = 'none';
    habitPage.style.display = 'block';
}

// --- ROLE LABEL TOGGLE ---
function toggleFields() {
    const role = document.getElementById('role').value;
    const label = document.getElementById('taskLabel');
    if (!label) return;

    if (role === "student") label.innerText = "Average Study Hours";
    else label.innerText = "Average Working Hours";
}

// --- SMART SYNC ---
function smartSync() {
    const role = document.getElementById('role').value;

    const simulatedData = {
        sleep: (6 + Math.random() * 2).toFixed(1),         // 6-8 hours
        screen: (3 + Math.random() * 2).toFixed(1),        // 3-5 hours
        calories: Math.floor(1800 + Math.random() * 500),  // 1800-2300
        taskHours: role === 'student' 
                    ? (3 + Math.random() * 2).toFixed(1) 
                    : (6 + Math.random() * 2).toFixed(1)
    };

    document.getElementById('sleep').value = simulatedData.sleep;
    document.getElementById('screen').value = simulatedData.screen;
    document.getElementById('calories').value = simulatedData.calories;
    document.getElementById('taskHours').value = simulatedData.taskHours;

    alert("Smart Sync complete! Your data has been automatically filled.");
}

// --- GENERATE INSIGHTS ---
async function generate() {
    const age = parseInt(document.getElementById('age').value) || 0;

    // Age validation
    if (age < 12) {
        alert("Sorry, this tool is not recommended for users below 12 years old.");
        return;
    }

    const role = document.getElementById('role').value;
    const sleep = parseFloat(document.getElementById('sleep').value) || 0;
    const screen = parseFloat(document.getElementById('screen').value) || 0;
    const calories = parseInt(document.getElementById('calories').value) || 0;
    const taskHours = parseFloat(document.getElementById('taskHours').value) || 0;

    const data = {
        role: role,
        age: age,
        sleep: sleep,
        screen: screen,
        calories: calories,
        study: role === "student" ? taskHours : 0,
        work_hours: role === "employee" ? taskHours : 0
    };

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Backend response was not OK");

        const result = await response.json();

        // --- STRESS RESULT ---
        const stressDiv = document.getElementById('stressResult');
        stressDiv.style.display = 'block';

        if (result.stress_level === "High") stressDiv.className = "high-stress";
        else if (result.stress_level === "Moderate") stressDiv.className = "mod-stress";
        else stressDiv.className = "low-stress";

        stressDiv.innerHTML = `
            <h3>Stress Status: ${result.stress_level}</h3>
            <p>Calculated Stress Index: <strong>${result.stress_score}</strong></p>
        `;

        // --- HABIT INSIGHTS ---
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';

        let suggestionsHtml = "<h4>Health Insights:</h4><ul>";
        if (result.suggestions && result.suggestions.length > 0) {
            result.suggestions.forEach(s => { suggestionsHtml += `<li>${s}</li>`; });
        } else {
            suggestionsHtml += "<li>No suggestions available</li>";
        }
        suggestionsHtml += "</ul>";
        suggestionsHtml += `<hr><p><strong>Overall Habit Score: ${result.score}/100</strong></p>`;
        resultDiv.innerHTML = suggestionsHtml;

    } catch (error) {
        console.error("Error connecting to Flask backend:", error);
        alert("Connection Error: Ensure your Flask server (app.py) is running.");
    }
}

// --- ADD EVENT LISTENERS ---
window.onload = function() {
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) signInBtn.addEventListener('click', login);

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) generateBtn.addEventListener('click', generate);

    const roleSelect = document.getElementById('role');
    if (roleSelect) roleSelect.addEventListener('change', toggleFields);

    const smartBtn = document.getElementById('smartSyncBtn');
    if (smartBtn) smartBtn.addEventListener('click', smartSync);
};