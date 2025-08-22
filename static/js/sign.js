// Select buttons and fields
const loginBtn = document.querySelector("#loginBtn");
const signupBtn = document.querySelector("#signupBtn");
const uploadNav = document.querySelector("#uploadNav"); // Upload link in header

// Load accounts from localStorage
let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
let loggedInUser = localStorage.getItem("loggedInUser");
let accessGranted = localStorage.getItem("accessGranted") === "true";

// Handle Log In
loginBtn.addEventListener("click", () => {
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (!username || !password || !email) {
    alert("Please fill all fields before logging in!");
    return;
  }

  if (accounts[username]) {
    alert("Account exists, just Sign Up.");
  } else {
    // First login → save account
    accounts[username] = { password, email };
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("accessGranted", "false");
    accessGranted = false;
    alert("Login successful! Account saved.");
  }
});

// Handle Sign Up
signupBtn.addEventListener("click", () => {
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const email = document.querySelector("#email").value.trim();

  if (!username || !password || !email) {
    alert("Please fill all fields before signing up!");
    return;
  }

  if (!accounts[username]) {
    alert("No account found. Please log in first.");
  } else {
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("accessGranted", "true");
    accessGranted = true;
    alert("Sign Up successful! You now have access to Upload.");
  }
});

// Handle Upload navigation click
uploadNav.addEventListener("click", (e) => {
  if (!accessGranted) {
    e.preventDefault(); // stop navigation
    alert("Please log in or sign up first!");
  } else {
    alert("You can now access the Upload page!");
    // allow navigation (upload.html)
  }
});

