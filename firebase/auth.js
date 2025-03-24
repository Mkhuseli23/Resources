// auth.js
import firebase from '../firebase';  // Import the initialized Firebase instance

// Function to create a new user with email and password
export const createUserWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

// Function to sign in the user
export const signInWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

// Additional auth functions can go here
