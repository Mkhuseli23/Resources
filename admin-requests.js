import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc, getDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Fetch and display requests in the admin panel
function fetchRequests() {
    const requestsRef = collection(db, 'requests');
    getDocs(requestsRef)
        .then((snapshot) => {
            const requestContainer = document.getElementById('request-container');
            requestContainer.innerHTML = '';

            if (snapshot.empty) {
                requestContainer.innerHTML = '<p>No pending requests.</p>'; // Show message if no requests
                return;
            }

            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                const requestId = docSnap.id;

                const requestCard = document.createElement('div');
                requestCard.classList.add('request-card');
                requestCard.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Requested By:</strong> ${data.userId}</p>
                    <button class="approve-btn" data-request-id="${requestId}" data-resource-id="${data.resourceId}">Approve</button>
                    <button class="reject-btn" data-request-id="${requestId}" data-resource-id="${data.resourceId}">Reject</button>
                    <textarea class="admin-comment" placeholder="Add rejection comment"></textarea>
                `;

                requestContainer.appendChild(requestCard);
            });

            // Add event listeners for approve/reject buttons
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const requestId = this.getAttribute('data-request-id');
                    const resourceId = this.getAttribute('data-resource-id');
                    approveRequest(requestId, resourceId);
                });
            });

            document.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const requestId = this.getAttribute('data-request-id');
                    const resourceId = this.getAttribute('data-resource-id');
                    const comment = this.parentElement.querySelector('.admin-comment').value;
                    rejectRequest(requestId, resourceId, comment);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching requests:', error);
        });
}

// Approve request
function approveRequest(requestId, resourceId) {
    const resourceRef = doc(db, 'resources', resourceId);

    updateDoc(resourceRef, { status: 'approved' }) // Update status to 'approved'
        .then(() => deleteDoc(doc(db, 'requests', requestId))) // Delete request
        .then(() => {
            createNotification(requestId, 'approved', '');
            alert('Request approved and removed.');
            fetchRequests(); // Refresh list for the admin side

            // Now, update the user side after approval
            updateViewResourceButton(resourceId);
        })
        .catch(error => console.error('Error approving request:', error));
}

// Reject request
function rejectRequest(requestId, resourceId, adminComment) {
    deleteDoc(doc(db, 'requests', requestId)) // Delete request
        .then(() => {
            createNotification(requestId, 'rejected', adminComment);
            alert('Request rejected and removed.');
            fetchRequests(); // Refresh list
        })
        .catch(error => console.error('Error rejecting request:', error));
}

// Create notification for the user
function createNotification(requestId, status, adminComment) {
    getDoc(doc(db, 'requests', requestId))
        .then(snapshot => {
            if (!snapshot.exists()) {
                console.error("Request not found.");
                return;
            }

            const requestData = snapshot.data();
            const userId = requestData.userId;

            addDoc(collection(db, 'notifications'), {
                userId: userId,
                requestId: requestId,
                resourceTitle: requestData.title,
                status: status,
                adminComment: adminComment,
                timestamp: new Date()
            })
            .then(() => {
                console.log('Notification created for user!');
            })
            .catch(error => {
                console.error('Error creating notification:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching request data:', error);
        });
}

// Update user-side 'View Resource' button after approval
function updateViewResourceButton(resourceId) {
    const resourceRef = doc(db, 'resources', resourceId);

    getDoc(resourceRef).then(docSnap => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const resourceCard = document.querySelector(`button[data-resource-id="${resourceId}"]`).closest('.resource-card');

            if (resourceCard) {
                const viewButton = resourceCard.querySelector('.view-resource-btn');
                if (viewButton) {
                    viewButton.style.display = 'inline-block'; // Show the 'View Resource' button
                }
            }
        }
    });
}

// Attach functions to `window`
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;

// Load requests on page load
window.onload = () => {
    fetchRequests();
};
