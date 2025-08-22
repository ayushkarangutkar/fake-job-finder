document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav item
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("href") === currentPath) {
      item.classList.add("active");
    }
  });

  // Auto-scroll to result if available
  const resultBox = document.querySelector(".result-box");
  if (resultBox) {
    resultBox.scrollIntoView({ behavior: "smooth" });
  }
});
