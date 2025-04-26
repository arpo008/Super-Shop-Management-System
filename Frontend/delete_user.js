// Define the API endpoint
const apiUrl = "http://localhost:3000/api/deleteUser ";

// Fetch and display users
async function fetchAndDisplayUsers() {
    const loadingElement = document.getElementById("loading");
    const tableContainer = document.getElementById("userTableContainer");
    const tableBody = document.getElementById("userTableBody");
    const errorMessage = document.getElementById("errorMessage");

    // Get the auth token from localStorage
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
        alert("Authentication token not found. Please log in first.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    try {
        // Show loading text
        loadingElement.classList.remove("hidden");

        // Make a POST request to fetch user data
        const response = await fetch("http://localhost:3000/api/getAllUser ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` // Attach the token
            }
        });

        if (!response.ok) {
            // Handle unauthorized or other errors
            if (response.status === 401) {
                alert("Unauthorized access. Please log in again.");
                localStorage.removeItem("auth_token"); // Clear invalid token
                window.location.href = "login.html"; // Redirect to login
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch data.");
            }
        }

        const data = await response.json();
        const users = data.Users;

        // Hide loading text and error message
        loadingElement.classList.add("hidden");
        errorMessage.classList.add("hidden");

        // Show the table container
        tableContainer.classList.remove("hidden");

        // Clear previous table rows
        tableBody.innerHTML = "";

        // Populate the table with user data
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="text-center">${user.user_id}</td>
                <td class="text-center">${user.first_name}</td>
                <td class="text-center">${user.last_name}</td>
                <td class="text-center">
                    <button class="btn btn-danger" onclick="deleteUser (${user.user_id})">Toggle</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching user data:", error);

        // Hide loading text and table container
        loadingElement.classList.add("hidden");
        tableContainer.classList.add("hidden");

        // Show error message
        errorMessage.innerText = `Failed to load user data: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }
}

// Function to delete a user
async function deleteUser (userId) {
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
        alert("Authentication token not found. Please log in first.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` // Attach the token
            },
            body: JSON.stringify({ user_id: userId }) // Send user ID in the request body
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Show success message
            fetchAndDisplayUsers(); // Refresh the user list
        } else {
            alert(result.message); // Show error message
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again later.");
    }
}

// Fetch users when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);