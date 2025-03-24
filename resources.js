import { auth, db } from "./firebase.js";
import { collection, query, where, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

                let resourceContent = `
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                `;

                // Conditionally render the appropriate button
                if (data.status === 'approved') {
                    resourceContent += `
                        <button class="view-resource-btn" 
                            data-resource-id="${doc.id}" 
                            data-filetype="${data.fileType}">
                            View Resource
                        </button>
                    `;
                } else {
                    resourceContent += `
                        <button class="request-btn" 
                            data-resource-id="${doc.id}"
                            data-title="${data.title}"
                            data-description="${data.description}"
                            data-category="${data.category}"
                            data-filetype="${data.fileType}">
                            Request
                        </button>
                    `;
                }

                resourceCard.innerHTML = resourceContent;
                resourceContainer.appendChild(resourceCard);

                // Attach event listeners for 'Request' buttons
                const requestButton = resourceCard.querySelector('.request-btn');
                if (requestButton) {
                    requestButton.addEventListener('click', function() {
                        const resourceId = this.getAttribute('data-resource-id');
                        const title = this.getAttribute('data-title');
                        const description = this.getAttribute('data-description');
                        const category = this.getAttribute('data-category');
                        const fileType = this.getAttribute('data-filetype');

                        requestResource(resourceId, title, description, category, fileType);
                    });
                }

                // Attach event listeners for 'View Resource' buttons
                const viewButton = resourceCard.querySelector('.view-resource-btn');
                if (viewButton) {
                    viewButton.addEventListener('click', function() {
                        const fileType = this.getAttribute('data-filetype');
                        window.open(fileType, '_blank'); // Open the resource in a new tab
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching resources:', error);
        });
}


// Ensure only one call to fetchResources() on page load
window.onload = () => {
    console.log('Loading resources...');
    fetchResources(); // Load all resources initially
};


// Request a resource
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

// Search Resources as User Types
document.getElementById('searchBar').addEventListener('input', function () {
    const query = this.value;
    fetchResources(query);
});

// Load resources on page load
window.onload = () => {
    fetchResources(); // Load all resources initially
};
