function isLettersOnly(value) {
  return /^[A-Za-z]+$/.test(value);
}

// Function to clear form inputs and error messages
function clearFormInputsAndErrors() {
  document.getElementById("email").value = "";
  document.querySelector('input[name="firstName"]').value = "";
  document.querySelector('input[name="lastName"]').value = "";
  document.querySelector('input[name="password"]').value = "";

  const errorElements = [
    "emailError",
    "firstNameError",
    "lastNameError",
    "passwordError",
  ];

  for (const elementId of errorElements) {
    const element = document.getElementById(elementId);
    element.textContent = "";
    element.style.display = "none";
  }
}

// Function to save user data in local storage as an array
function saveUserData() {
  const email = document.getElementById("email").value;
  const firstName = document.querySelector('input[name="firstName"]').value;
  const lastName = document.querySelector('input[name="lastName"]').value;
  const password = document.querySelector('input[name="password"]').value;

  // Basic email validation
  if (email.trim() === "") {
    document.getElementById("emailError").textContent =
      "Email field is required";
    document.getElementById("emailError").style.display = "block";
    return;
  } else if (!isValidEmail(email)) {
    document.getElementById("emailError").textContent = "Invalid email format";
    document.getElementById("emailError").style.display = "block"; // Show the error message
    return; // Return early to prevent further processing
  } else {
    document.getElementById("emailError").textContent = ""; // Clear the error message
    document.getElementById("emailError").style.display = "none"; // Hide the error message
  }

  // First name validation
  if (firstName.trim() === "") {
    document.getElementById("firstNameError").textContent =
      "First name is required";
    document.getElementById("firstNameError").style.display = "block";
    return;
  } else if (!isLettersOnly(firstName)) {
    document.getElementById("firstNameError").textContent =
      "First name can only contain letters";
    document.getElementById("firstNameError").style.display = "block";
    return;
  } else {
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("firstNameError").style.display = "none";
  }

  // Last name validation
  if (lastName.trim() === "") {
    document.getElementById("lastNameError").textContent =
      "Last name is required";
    document.getElementById("lastNameError").style.display = "block";
    return;
  } else if (!isLettersOnly(lastName)) {
    document.getElementById("lastNameError").textContent =
      "Last name can only contain letters";
    document.getElementById("lastNameError").style.display = "block";
    return;
  } else {
    document.getElementById("lastNameError").textContent = "";
    document.getElementById("lastNameError").style.display = "none";
  }

  // Password validation
  let errorText = isStrongPassword(password);
  if (errorText !== "Password is strong.") {
    document.getElementById("passwordError").textContent = errorText;
    document.getElementById("passwordError").style.display = "block";
    return;
  } else {
    document.getElementById("passwordError").textContent = "";
    document.getElementById("passwordError").style.display = "none";
  }

  // Check if the user already exists by comparing email addresses
  const userExists = users.some((existingUser) => existingUser.email === email);

  if (!userExists) {
    // Create a new user object
    const user = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      score: 0,
    };

    // If the user does not exist, add the new user object to the array
    users.push(user);
    // Save the updated users array to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Redirect to the home page after a successful registration
    window.location.href = "http://127.0.0.1:5500/index.html";
  } else {
    // Handle the case where the user already exists
    const userExistsError = document.getElementById("userExistsError");
    userExistsError.textContent = "A user with this email already exists.";
    userExistsError.style.display = "block";

    // Set a timer to hide the error message after 3 seconds
    setTimeout(() => {
      userExistsError.style.display = "none";
    }, 3000);
  }

  // Clear the form inputs and error messages
  clearFormInputsAndErrors();

  // Display the updated user data array
  console.log("Updated User Data Array:", users);
}
document.addEventListener("submit", function (event) {
  if (event.target && event.target.id === "userForm") {
    event.preventDefault(); // Prevent the default form submission
    saveUserData();
  }
});
