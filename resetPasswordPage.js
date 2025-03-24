import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth } from "./firebase.js";

// Handle password reset on form submit
document.getElementById("resetPasswordForm").addEventListener("submit", async (event) => {
  event.preventDefault();  // Prevent form from submitting and page reload

  const email = document.getElementById("email").value;
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  if (!email) {
    errorMessage.textContent = "Please enter your email.";
    return;
  }

  try {
    // Send the password reset email
    await sendPasswordResetEmail(auth, email);
    
    // Display success message
    successMessage.textContent = "Password reset link sent! Please check your email.";
    errorMessage.textContent = ""; // Clear error message if successful
  } catch (error) {
    // Display error message
    errorMessage.textContent = "Error: " + error.message;
    successMessage.textContent = ""; // Clear success message if error occurs
    console.error("Password reset error:", error); // Log error to console
  }
});
