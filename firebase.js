// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP_LRbZAuuUV-hJ7gtxXmAl3Q3fFSWGAc",
  authDomain: "the5guyssupport.firebaseapp.com",
  projectId: "the5guyssupport",
  storageBucket: "the5guyssupport.firebasestorage.app",
  messagingSenderId: "473103092220",
  appId: "1:473103092220:web:66736d12a9ba65164a8a79",
  measurementId: "G-2WS9V43N4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Add Resource to Firestore
async function addResource(title, description, fileType, category) {
  try {
    const docRef = await addDoc(collection(db, "resources"), {
      title: title,
      description: description,
      fileType: fileType,
      category: category
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Export functions
export { addResource, db, auth, signOut };


