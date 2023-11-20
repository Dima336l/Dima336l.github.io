var users = JSON.parse(localStorage.getItem("users")) || [];
function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

// Function to check the validity of password
function isStrongPassword(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit.";
  }

  // Check if the password contains at least one special character
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  // If all complexity criteria are met
  return "Password is strong.";
}

// Function to set up password visibility toggle
function setupPasswordToggle() {
  const togglePassword = document.querySelector("#togglePassword");
  const passwordInput = document.querySelector("#password");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function (e) {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      if (type === "password") {
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
      } else {
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
      }
    });
  }
}

setupPasswordToggle();
isValidEmail();