import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

window.registerUser = async function () {
  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const repassword = document.getElementById("repassword").value.trim();

  if (!name || !surname || !email || !password || !repassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== repassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Create user in Firebase Authentication (no reCAPTCHA needed)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      surname: surname,
      email: email,
      role: "student", // Default role
      createdAt: new Date()
    });

    // Clear input fields
    document.getElementById("signupForm").reset();

    // Show success message
    alert("Registration successful! Redirecting to your dashboard...");

    // Redirect to user dashboard
    window.location.href = "resource.html";
  } catch (error) {
    console.error("Registration error:", error);
    alert("Error: " + error.message);
  }

};
  // Function to navigate to the login page
window.navigateToLogin = function() {
  window.location.href = "login.html";
};


