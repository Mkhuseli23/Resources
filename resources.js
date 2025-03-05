// main.js or your app file
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { collection, query, where, getDocs, addDoc, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// Fetch Resources from Firestore
function fetchResources(queryStr = '') {
    const resourcesRef = collection(db, 'resources');
    const q = query(resourcesRef, where('title', '>=', queryStr), where('title', '<=', queryStr + '\uf8ff'));

    getDocs(q)
        .then(snapshot => {
            const resourceContainer = document.getElementById('resource-container');
            resourceContainer.innerHTML = ''; // Clear existing resources

            snapshot.forEach(doc => {
                const data = doc.data();
                const resourceCard = document.createElement('div');
                resourceCard.classList.add('resource-card');

                let resourceContent = '';
                if (data.category === 'Video Tutorial') {
                    resourceContent = `
                        <iframe src="${data.fileType}" frameborder="0" allowfullscreen></iframe>
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <button class="request-btn" ${data.locked ? 'disabled' : ''} 
                            data-resource-id="${doc.id}"
                            data-title="${data.title}"
                            data-description="${data.description}"
                            data-category="${data.category}"
                            data-filetype="${data.fileType}">
                            ${data.locked ? 'Locked' : 'Request'}
                        </button>
                    `;
                } else {
                    resourceContent = `
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <p><strong>Category:</strong> ${data.category}</p>
                        <button class="request-btn" ${data.locked ? 'disabled' : ''} 
                            data-resource-id="${doc.id}"
                            data-title="${data.title}"
                            data-description="${data.description}"
                            data-category="${data.category}"
                            data-filetype="${data.fileType}">
                            ${data.locked ? 'Locked' : 'Request'}
                        </button>
                    `;
                }

                resourceCard.innerHTML = resourceContent;
                resourceContainer.appendChild(resourceCard);
            });

            // Attach event listeners after loading the resources
            const requestButtons = document.querySelectorAll('.request-btn');
            requestButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const resourceId = this.getAttribute('data-resource-id');
                    const title = this.getAttribute('data-title');
                    const description = this.getAttribute('data-description');
                    const category = this.getAttribute('data-category');
                    const fileType = this.getAttribute('data-filetype');

                    // Call the requestResource function with the necessary data
                    requestResource(resourceId, title, description, category, fileType);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching resources:', error);
        });
}
function requestResource(resourceId, title, description, category, fileType) {
    const userId = auth.currentUser ? auth.currentUser.uid : 'guest'; // Use the current logged-in user's ID

    // Add user request to Firestore
    addDoc(collection(db, 'requests'), {
        userId,
        resourceId,
        title,
        description,
        category,
        fileType,
        status: 'pending', // Initially, status is 'pending'
        adminComment: '' // Admin can later add a comment
    })
    .then(() => {
        // Lock the resource upon request, preventing further requests until approved
        const resourceRef = doc(db, 'resources', resourceId);
        updateDoc(resourceRef, { locked: true });

        // Find the button and change its text and style to "Pending"
        const requestButton = document.querySelector(`button[data-resource-id="${resourceId}"]`);
        if (requestButton) {
            requestButton.innerText = 'Pending';
            requestButton.disabled = true; // Disable the button after request
            requestButton.style.backgroundColor = '#ccc'; // Change color to indicate pending state
        }

        alert('Request submitted successfully! You will be notified once the admin approves your request.');
    })
    .catch(error => {
        console.error('Error requesting resource:', error);
    });
}


// Search Resources
function searchResources() {
    const query = document.getElementById('searchBar').value;
    fetchResources(query);
}


// Log out function
function logout() {
    signOut(auth)
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
}

// Load resources on page load
window.onload = () => {
    fetchResources(); // Load all resources initially
};
