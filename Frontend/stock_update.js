const apiUrlProducts = "http://localhost:3000/api/getAllProduct";
const apiUrlUpdate = "http://localhost:3000/api/updateProductQuantity";

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

        const response = await fetch(apiUrlProducts, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching data: ${errorText}`);
        }

        const data = await response.json();
        if (!data.Products || data.Products.length === 0) {
            throw new Error("No products found.");
        }

        const products = data.Products;

        // Sort products by product_id in ascending order
        products.sort((a, b) => a.product_id - b.product_id);

        loadingElement.classList.add("hidden");
        errorMessage.classList.add("hidden");
        tableContainer.classList.remove("hidden");

        tableBody.innerHTML = "";
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="text-center">${product.product_id}</td>
                <td class="text-center">${product.name}</td>
                <td class="text-center">${product.category}</td>
                <td class="text-center">${product.price}</td>
                <td class="text-center">${product.stock_quantity}</td>
                <td class="text-center">
                    <input type="number" class="input input-bordered w-20" min="0" id="update-quantity-${product.product_id}" placeholder="Qty">
                    <button class="btn btn-primary ml-2" onclick="updateProductStock(${product.product_id})">Update</button>
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

async function updateProductStock(productId) {
    const authToken = localStorage.getItem("auth_token");
    const inputField = document.getElementById(`update-quantity-${productId}`);
    const newQuantity = parseInt(inputField.value, 10);

    if (isNaN(newQuantity) || newQuantity < 0) {
        alert("Please enter a valid non-negative quantity.");
        return;
    }

    try {
        const response = await fetch(apiUrlUpdate, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ id: productId, quantity: newQuantity })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            fetchAndDisplayProducts();
        } else {
            throw new Error(data.message || "Failed to update stock quantity.");
        }
    } catch (error) {
        console.error("Error updating product stock:", error);
        alert(`Failed to update stock: ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayProducts);