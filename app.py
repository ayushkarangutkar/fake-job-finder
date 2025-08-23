import os
import time
import joblib
import pandas as pd
import json
from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for, flash, session
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, f1_score
from sklearn.preprocessing import LabelEncoder

# ===============================
# Flask App Setup
# ===============================
app = Flask(__name__)
app.secret_key = "supersecretkey"

# Base directory (safe paths for Render & local)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure upload folder exists
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ===============================
# Load dataset (safe path)
# ===============================
df = pd.read_csv(os.path.join(BASE_DIR, "fake_job_postings.csv"))

features = ["telecommuting", "has_company_logo", "has_questions",
            "employment_type", "required_experience", "required_education"]

X = df[features].copy()
y = df["fraudulent"]

for col in ["employment_type", "required_experience", "required_education"]:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ===============================
# Load trained models (safe paths)
# ===============================
models = {
    "SVM": joblib.load(os.path.join(BASE_DIR, "svm_structured.pkl")),
    "Extra Trees": joblib.load(os.path.join(BASE_DIR, "extratrees_structured.pkl")),
    "Passive Aggressive": joblib.load(os.path.join(BASE_DIR, "passive_structured.pkl")),
    "XGBoost": joblib.load(os.path.join(BASE_DIR, "xgboost_structured.pkl"))
}

# Fast text model
fast_model = joblib.load(os.path.join(BASE_DIR, "fast_model.pkl"))

# ===============================
# Evaluate models for charts
# ===============================
metrics = {"Accuracy": {}, "F1 Score": {}, "CV Accuracy": {}, "Training Time": {}}

for name, model in models.items():
    start = time.time()
    model.fit(X_train, y_train)
    end = time.time()
    metrics["Training Time"][name] = round(end - start, 2)

    y_pred = model.predict(X_test)
    metrics["Accuracy"][name] = round(accuracy_score(y_test, y_pred), 2)
    metrics["F1 Score"][name] = round(f1_score(y_test, y_pred, average="macro", zero_division=1), 2)

    cv_scores = cross_val_score(model, X, y, cv=3, scoring="accuracy")
    metrics["CV Accuracy"][name] = round(cv_scores.mean(), 2)

print("✅ Model evaluation done!")

# ===============================
# Global variable for storing last uploaded file
# ===============================
uploaded_file_path = None

# ===============================
# Routes
# ===============================
@app.route("/")
def ind():
    return render_template("ind.html")

@app.route("/signup")
def signup():
    return render_template("sign.html")

@app.route("/upload", methods=["GET", "POST"])
def upload():
    global uploaded_file_path
    if request.method == "POST":
        file = request.files["file"]
        if file and file.filename.endswith(".csv"):
            uploaded_file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(uploaded_file_path)
            flash(" upload file here !")
            return redirect(url_for("preview"))
        else:
            flash("⚠️ Please upload a valid CSV file")
            return redirect(url_for("upload"))
    return render_template("upload.html")

@app.route("/preview")
def preview():
    global uploaded_file_path
    if uploaded_file_path and os.path.exists(uploaded_file_path):
        df = pd.read_csv(uploaded_file_path)
        table_html = df.to_html(classes="table table-striped", index=False)
    else:
        table_html = "<p>No data uploaded yet. Please upload first.</p>"
    return render_template("preview.html", table=table_html)

@app.route("/index")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    job_title = request.form["title"]
    job_company = request.form["company_profile"]
    job_desc = request.form["description"]
    job_req = request.form["requirements"]
    job_benefits = request.form["benefits"]

    text = f"{job_title} {job_company} {job_desc} {job_req} {job_benefits}"
    prediction = fast_model.predict([text])[0]
    result = "✅ Legit Job Posting" if prediction == 0 else "❌ Fake Job Posting"

    return render_template("index.html",
                           result=result,
                           title=job_title,
                           company=job_company,
                           description=job_desc,
                           requirements=job_req,
                           benefits=job_benefits)

@app.route("/perf")
def perf():
    return render_template("perf.html")

@app.route("/charts")
def charts():
    return render_template("charts.html", chart_data=json.dumps(metrics))

@app.route("/info")
def info():
    return render_template("info.html")

@app.route("/download_csv")
def download_csv():
    return send_file(os.path.join(BASE_DIR, "fake_job_postings.csv"), as_attachment=True)

@app.route("/download_pdf")
def download_pdf():
    return send_file(os.path.join(BASE_DIR,"fake_job_report.pdf", as_attachment=True)

# ===============================
# Run App
# ===============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
