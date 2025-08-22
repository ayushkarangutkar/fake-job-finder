// charts.js

function createBarChart(canvasId, label, dataObj, yLabel, color) {
    const ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(dataObj), // model names (SVM, Extra Trees, etc.)
            datasets: [{
                label: label,
                data: Object.values(dataObj),
                backgroundColor: color,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: label,
                    font: { size: 18 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yLabel
                    }
                }
            }
        }
    });
}

// ✅ Render all charts with medium-dark colors
document.addEventListener("DOMContentLoaded", function () {
    createBarChart("accChart", "Model Accuracy", metrics.Accuracy, "Accuracy", "rgba(54, 162, 162, 0.9)");   // teal (darker)
    createBarChart("f1Chart", "Model F1 Score", metrics["F1 Score"], "F1 Score", "rgba(230, 120, 30, 0.9)"); // dark orange
    createBarChart("cvChart", "Cross-Validation Accuracy", metrics["CV Accuracy"], "CV Accuracy", "rgba(102, 51, 204, 0.9)"); // deep purple
    createBarChart("timeChart", "Training Time (seconds)", metrics["Training Time"], "Seconds", "rgba(200, 50, 80, 0.9)"); // darker red-pink
});


