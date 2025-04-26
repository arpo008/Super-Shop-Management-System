const apiUrl = "http://localhost:3000/api/getAllProduct";
const deleteApiUrl = "http://localhost:3000/api/deleteProduct";

async function fetchAndDisplayProducts() {
    const loadingElement = document.getElementById("loading");
    const tableContainer = document.getElementById("productTableContainer");
    const tableBody = document.getElementById("productTableBody");
    const errorMessage = document.getElementById("errorMessage");
    
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
        alert("Authentication token not found. Please log in first.");
        window.location.href = "login.html";
        return;
    }
    
    try {
        loadingElement.classList.remove("hidden");
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                alert("Unauthorized access. Please log in again.");
                localStorage.removeItem("auth_token");
                window.location.href = "login.html";
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch data.");
            }
        }
        
        const data = await response.json();
        const products = data.Products.sort((a, b) => a.product_id - b.product_id);
        
        loadingElement.classList.add("hidden");
        errorMessage.classList.add("hidden");
        tableContainer.classList.remove("hidden");
        tableBody.innerHTML = "";
        
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
                <td class="text-center">
                    <button class="btn bg-red-600 text-white rounded-lg hover:bg-red-700" onclick="deleteProduct(${product.product_id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching product data:", error);
        loadingElement.classList.add("hidden");
        tableContainer.classList.add("hidden");
        errorMessage.innerText = `Failed to load product data: ${error.message}`;
        errorMessage.classList.remove("hidden");
    }
}

async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
        alert("Authentication token not found. Please log in first.");
        window.location.href = "login.html";
        return;
    }
    
    try {
        const response = await fetch(deleteApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ id: productId }) // Fix field name
        });
        
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete product.");
        }
        
        alert("Product deleted successfully!");
        fetchAndDisplayProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Error: ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayProducts);
