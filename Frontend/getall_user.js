// Define the API endpoint
const apiUrl = "http://localhost:3000/api/getAllUser";

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
        const response = await fetch(apiUrl, {
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
                <td class="text-center">${user.address}</td>
                <td class="text-center">${user.gender}</td>
                <td class="text-center">${new Date(user.dob).toLocaleDateString()}</td>
                <td class="text-center">${user.telephone}</td>
                <td class="text-center">${user.age}</td>
                <td class="text-center">${user.salary}</td>
                <td class="text-center">${user.role}</td>
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

// Fetch users when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
