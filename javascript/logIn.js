document.addEventListener("submit", function (event) {
  if (event.target && event.target.id === "loginForm") {
    event.preventDefault(); // Prevent the default form submission

    const emailInput = event.target.querySelector("#email");
    const passwordInput = event.target.querySelector("#password");

    // Function to display an error message
    function displayError(fieldId, message) {
      const errorElement = document.getElementById(fieldId);
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }

    // Function to hide an error message
    function hideError(fieldId) {
      const errorElement = document.getElementById(fieldId);
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    // Email validation
    if (email.trim() === "") {
      displayError("emailError", "Email field is required");
      return;
    } else {
      hideError("emailError");
    }

    if (!isValidEmail(email)) {
      displayError("emailError", "Invalid email format");
      return;
    } else {
      hideError("emailError");
    }

    if (password.trim() === "") {
      displayError("logInError", "Password field is required");
      return;
    } else {
      hideError("logInError");
    }

    const user = users.find(
      (existingUser) =>
        existingUser.email === email && existingUser.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      // Successful login, redirecting to home page
      window.location.href = "http://127.0.0.1:5500/index.html";
    } else {
      // Failed login
      const loginError = event.target.querySelector("#loginError");
      loginError.textContent = "Invalid email or password.";
      loginError.style.display = "block";
      setTimeout(() => {
        loginError.style.display = "none";
      }, 3000);
    }
  }
});
