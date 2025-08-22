document.addEventListener("DOMContentLoaded", function () {
  const trainBtn = document.getElementById("trainBtn");
  const nextLink = document.getElementById("nextLink");

  let trained = false;

  trainBtn.addEventListener("click", () => {
    alert("✅ Train/Test completed successfully! Now you can go to Next.");
    trained = true;
  });

  nextLink.addEventListener("click", (e) => {
    if (!trained) {
      e.preventDefault();
      alert("⚠️ Please run Train/Test before proceeding!");
    }
  });
});
