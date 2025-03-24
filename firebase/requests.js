// src/firebase/requests.js
import { db } from './firebase'; // Import the Firestore instance from your Firebase config
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Fetch all requests from Firestore
export const fetchRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'requests'));
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw new Error('Error fetching requests');
  }
};

// Update the status of a request in Firestore
export const updateRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, 'requests', requestId);
    await updateDoc(requestRef, { status });
    return { requestId, status }; // Return the updated status
  } catch (error) {
    console.error('Error updating request status:', error);
    throw new Error('Error updating request status');
  }
};
