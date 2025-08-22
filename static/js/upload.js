document.addEventListener("DOMContentLoaded", function () {
  const flashMsg = document.querySelector(".flash");
  if (flashMsg) {
    setTimeout(() => {
      flashMsg.style.display = "none";
    }, 3000);
  }
});
