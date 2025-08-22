// If you need dropdown toggle logic (optional for mobile use case)
document.addEventListener("DOMContentLoaded", () => {
  const dropbtn = document.querySelector(".dropbtn");
  const dropdown = document.querySelector(".dropdown-content");

  dropbtn.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  window.addEventListener("click", (e) => {
    if (!e.target.matches(".dropbtn")) {
      dropdown.style.display = "none";
    }
  });
});
