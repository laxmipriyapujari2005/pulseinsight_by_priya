from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# -------- STUDENT STRESS MODEL --------
# Based on sleep and screen time

def student_stress(screen, sleep):

    stress = 1.9 + (0.93 * screen) - (0.006 * sleep)

    if stress < 3:
        level = "Low"
    elif stress < 6:
        level = "Moderate"
    else:
        level = "High"

    return round(stress,2), level


# -------- EMPLOYEE STRESS MODEL --------
# Based on working hours

def employee_stress(work_hours):

    stress = 0.9 + (0.75 * work_hours)

    if stress < 4:
        level = "Low"
    elif stress < 7:
        level = "Moderate"
    else:
        level = "High"

    return round(stress,2), level


# -------- HABIT ANALYSIS --------

def analyze_data(role, sleep, study, calories, screen, work_hours):

    score = 100
    suggestions = []

    if sleep < 7:
        score -= 20
        suggestions.append("Increase sleep to at least 7 hours.")

    if study < 4 and role == "student":
        score -= 15
        suggestions.append("Try studying more consistently.")

    if calories < 300:
        score -= 15
        suggestions.append("Increase physical activity.")

    if screen > 6:
        score -= 20
        suggestions.append("Reduce screen time before sleep.")

    if score < 0:
        score = 0


    # -------- STRESS MODEL SELECTION --------

    if role == "student":

        stress_score, stress_level = student_stress(screen, sleep)

    elif role == "employee":

        stress_score, stress_level = employee_stress(work_hours)

    else:

        stress_score = 0
        stress_level = "Unknown"


    return score, suggestions, stress_score, stress_level


# -------- ROUTES --------

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json

    role = data["role"]

    sleep = float(data["sleep"])
    study = float(data["study"])
    calories = float(data["calories"])
    screen = float(data["screen"])

    work_hours = float(data.get("work_hours",0))

    score, suggestions, stress_score, stress_level = analyze_data(
        role, sleep, study, calories, screen, work_hours
    )

    return jsonify({
        "score": score,
        "suggestions": suggestions,
        "stress_score": stress_score,
        "stress_level": stress_level
    })


if __name__ == "__main__":
    app.run(debug=True)