import { db, auth } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ✅ Fetch notifications for the logged-in user
function fetchNotifications() {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
        console.log("No user logged in.");
        return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, where("userId", "==", userId));

    getDocs(q)
        .then(snapshot => {
            const notificationContainer = document.getElementById('notification-container');
            notificationContainer.innerHTML = '';

            if (snapshot.empty) {
                notificationContainer.innerHTML = "<p>No notifications found.</p>";
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                console.log("Notification data:", data);

                const notificationCard = document.createElement('div');
                notificationCard.classList.add('notification-card');

                notificationCard.innerHTML = `
                    <h3>Resource: ${data.resourceTitle}</h3>
                    <p>Status: <strong>${data.status}</strong></p>
                    <p>Admin Comment: ${data.adminComment || "No comment"}</p>
                    <p><small>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</small></p>
                `;

                notificationContainer.appendChild(notificationCard);
            });
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
        });
}

// ✅ Load notifications on page load
window.onload = () => {
    fetchNotifications();
};
