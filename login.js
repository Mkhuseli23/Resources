import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting and reloading
    loginUser();
});

function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill in both email and password fields.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Fetch the user role from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                // Redirect based on role
                if (role === "admin") {
                    window.location.href = "admindashboard.html";
                } else if (role === "student") {
                    window.location.href = "resource.html";
                } else {
                    alert("User role not found. Please contact support.");
                }
            } else {
                alert("User data not found.");
            }
        })
        .catch((error) => {
            alert(`Login failed: ${error.message}`);
        });
}
