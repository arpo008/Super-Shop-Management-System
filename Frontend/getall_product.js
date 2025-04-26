// Define the API endpoint
const apiUrl = "http://localhost:3000/api/getAllProduct";

// Fetch and display products
async function fetchAndDisplayProducts() {
    const loadingElement = document.getElementById("loading");
    const tableContainer = document.getElementById("productTableContainer");
    const tableBody = document.getElementById("productTableBody");
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

        // Make a POST request to fetch product data
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
        const products = data.Products;

        // Sort products by product_id in ascending order
        products.sort((a, b) => a.product_id - b.product_id);

        // Hide loading text and error message
        loadingElement.classList.add("hidden");
        errorMessage.classList.add("hidden");

        // Show the table container
        tableContainer.classList.remove("hidden");

        // Clear previous table rows
        tableBody.innerHTML = "";

        // Populate the table with product data
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="text-center">${product.product_id}</td>
                <td class="text-center">${product.name}</td>
                <td class="text-center">$${parseFloat(product.price).toFixed(2)}</td>
                <td class="text-center">${product.category}</td>
                <td class="text-center">${product.stock_quantity}</td>
                <td class="text-center">${new Date(product.created_at).toLocaleDateString()}</td>
                <td class="text-center">${new Date(product.updated_at).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching product data:", error);

        // Hide loading text and table container
        loadingElement.classList.add("hidden");
        tableContainer.classList.add("hidden");

        // Show error message
        errorMessage.innerText = `Failed to load product data: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }
}

// Fetch products when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchAndDisplayProducts);