// Import Firebase & Firestore functions
import { db, auth } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Ensure Firebase is initialized
document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "login.html";
        }
    });

    fetchResources();
});

// Fetch resources from Firebase
async function fetchResources() {
    const resourceList = document.getElementById("resource-list");
    resourceList.innerHTML = "";

    try {
        console.log("Firestore instance:", db); // Debugging line to check if db is initialized
        if (!db) {
            throw new Error("Firestore database is not initialized.");
        }

        // Get resources collection
        const resourceCollection = collection(db, "resources");
        const snapshot = await getDocs(resourceCollection);

        snapshot.forEach(doc => {
            const resource = doc.data();
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h2>${resource.title}</h2>
                <p>${resource.description}</p>
                <p><strong>Type:</strong> ${resource.fileType}</p>
                <p><strong>Category:</strong> ${resource.category}</p>
                <button onclick="deleteResource('${doc.id}')">Delete</button>
                <button onclick="updateResource('${doc.id}', '${resource.title}', '${resource.description}', '${resource.fileType}', '${resource.category}')">Update</button>
            `;
            resourceList.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching resources:", error);
    }
}

// Add a resource
async function addResource() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const fileType = document.getElementById("fileType").value.trim();
    const category = document.getElementById("category").value.trim();

    if (!title || !description || !fileType || !category) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        await addDoc(collection(db, "resources"), { title, description, fileType, category });
        alert("Resource added successfully!");
        fetchResources();
    } catch (error) {
        console.error("Error adding resource:", error);
    }
}

// Delete a resource
async function deleteResource(id) {
    try {
        await deleteDoc(doc(db, "resources", id));
        fetchResources();
    } catch (error) {
        console.error("Error deleting resource:", error);
    }
}

// Update a resource
async function updateResource(id, oldTitle, oldDescription, oldFileType, oldCategory) {
    const newTitle = prompt("Enter new title:", oldTitle);
    const newDescription = prompt("Enter new description:", oldDescription);
    const newFileType = prompt("Enter new file type:", oldFileType);
    const newCategory = prompt("Enter new category:", oldCategory);

    if (newTitle && newDescription && newFileType && newCategory) {
        try {
            await updateDoc(doc(db, "resources", id), {
                title: newTitle,
                description: newDescription,
                fileType: newFileType,
                category: newCategory
            });
            fetchResources();
        } catch (error) {
            console.error("Error updating resource:", error);
        }
    }
}

// Make functions global
window.addResource = addResource;
window.deleteResource = deleteResource;
window.updateResource = updateResource;
window.logout = function () {
    auth.signOut().then(() => window.location.href = "login.html");
};
