// db.js
import firebase from '../firebase'; // Import the initialized Firebase instance

// Reference to Firestore
const db = firebase.firestore();

// Function to add user data to Firestore
export const addUserToFirestore = (userId, userData) => {
  return db.collection('users').doc(userId).set(userData);
};

// Other Firestore functions can go here
