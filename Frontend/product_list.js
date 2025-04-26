// Define the API endpoint
const apiUrl = "http://localhost:3000/api/getAllProduct";

// Fetch and display products
async function fetchAndDisplayProducts() {
    const loadingElement = document.getElementById("loading");
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

        // Make a GET request to fetch product data
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
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

        // Hide loading text and error message
        loadingElement.classList.add("hidden");
        errorMessage.classList.add("hidden");

        // Clear previous table rows
        tableBody.innerHTML = "";

        // Populate the table with product data
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.product_id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>
                    <!-- Update button passes product_id and category -->
                    <a href="update.html?product_id=${product.product_id}&category=${product.category}" class="btn bg-yellow-500 font-bold">Update</a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching product data:", error);

        // Hide loading text
        loadingElement.classList.add("hidden");

        // Show error message
        errorMessage.innerText = `Failed to load product data: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }
}

// Fetch products when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchAndDisplayProducts);
