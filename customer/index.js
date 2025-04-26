// Utility Functions
const showSpinner = () => {
    document.getElementById("spinner").classList.remove("hidden");
};

const hideSpinner = () => {
    document.getElementById("spinner").classList.add("hidden");
};

// Token Management
const checkAuth = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "login.html";
        return false;
    }
    return true;
};

// Global Variables
let allProducts = [];
let cart = {};

// Product Functions
const fetchProducts = async () => {
    if (!checkAuth()) return;
    showSpinner();

    try {
        const response = await fetch("http://localhost:3000/api/getAllProduct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();
        if (data?.Products) {
            allProducts = data.Products;
            displayProducts(allProducts);
        } else {
            throw new Error("Invalid product data");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load products");
    } finally {
        hideSpinner();
    }
};

const filterProductsByCategory = (category) => {
    const filtered = category === 'All' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);
    displayProducts(filtered);
};

const displayProducts = (products) => {
    const container = document.getElementById("product-container");
    container.innerHTML = products.length ? "" : `
        <div class="text-center col-span-full">
            <h2 class="text-2xl font-semibold text-gray-700">No Products Found</h2>
        </div>
    `;

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "card bg-white shadow-md rounded-lg overflow-hidden";
        card.innerHTML = `
            <div class="p-4">
                <h2 class="text-xl font-bold mb-2">${product.name}</h2>
                <p class="text-gray-600">Category: ${product.category}</p>
                <p class="text-gray-600">Price: $${product.price}</p>
                <p class="text-gray-600">Stock: ${product.stock_quantity}</p>
               
                <div class="flex justify-between mt-4">
                    <button class="btn btn-secondary" onclick="decrementQuantity(${product.product_id})">-</button>
                    <input type="number" id="quantity-${product.product_id}" 
                           class="input input-bordered w-20 text-center" 
                           value="1" min="1" max="${product.stock_quantity}">
                    <button class="btn btn-primary" onclick="incrementQuantity(${product.product_id}, ${product.stock_quantity})">+</button>
                </div>
                
                <div class="flex justify-center mt-4">
                    <button class="btn btn-primary" 
                            onclick="addToCart(${product.product_id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, ${product.stock_quantity})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};

// Quantity Functions
const incrementQuantity = (id, max) => {
    const input = document.getElementById(`quantity-${id}`);
    if (parseInt(input.value) < max) input.value = parseInt(input.value) + 1;
};

const decrementQuantity = (id) => {
    const input = document.getElementById(`quantity-${id}`);
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
};

// Cart Functions
const addToCart = (id, name, price, max) => {
    const quantity = parseInt(document.getElementById(`quantity-${id}`).value);
    
    if (quantity > max) {
        alert(`Only ${max} items available`);
        return;
    }

    cart[id] = cart[id] ? {
        ...cart[id],
        quantity: cart[id].quantity + quantity
    } : { id, name, price, quantity };

    updateCartUI();
};

const updateCartUI = () => {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("total-price");
    let total = 0;

    container.innerHTML = Object.keys(cart).length ? "" : "<p>Your cart is empty</p>";

    Object.values(cart).forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const div = document.createElement("div");
        div.className = "flex justify-between";
        div.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        container.appendChild(div);
    });

    totalElement.textContent = `Total: $${total.toFixed(2)}`;
};

// Purchase Functions
const purchase = async () => {
    if (!checkAuth()) return;
    if (!Object.keys(cart).length) {
        alert("Your cart is empty");
        return;
    }

    showSpinner();

    try {
        const response = await fetch("http://localhost:3000/api/buyProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
            body: JSON.stringify({
                products: Object.values(cart).map(item => ({
                    id: item.id,               // ✅ this should be 'id' not 'product_id'
                    quantity: item.quantity
                }))
            })
        });

        if (!response.ok) {
            throw new Error(`Purchase failed: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Save proper structure to localStorage for memo page
        localStorage.setItem("purchaseDetails", JSON.stringify({
            products: Object.values(cart),
            totalPrice: data.totalPrice,
            date: new Date().toLocaleString()
        }));

        cart = {};
        updateCartUI();
        window.location.href = "memo.html";

    } catch (error) {
        console.error("Purchase error:", error);
        alert("Purchase failed. Please try again.");
    } finally {
        hideSpinner();
    }
};

// Bag Selection

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    if (checkAuth()) {
        console.log("Auth token:", localStorage.getItem("auth_token"));
        fetchProducts();
    }
});