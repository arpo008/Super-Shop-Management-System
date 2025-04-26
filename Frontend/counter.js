const showSpinner = () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");
};

const hideSpinner = () => {
    const spinner = document.getElementById("spinner");
    spinner.classList.add("hidden");
};

let allProducts = []; // Store all products globally for filtering
let cart = {}; // Cart to store the added products

// Fetch products from backend
const fetchProducts = async () => {
    showSpinner();

    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
        alert("You are not logged in. Please login to access this page.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/getAllProduct", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`, // Include token in headers
            },
        });

        if (res.ok) {
            const data = await res.json();
            allProducts = data.Products; // Save all products globally
            console.log("Fetched Products: ", allProducts);
            displayProducts(allProducts);
        } else {
            const errorData = await res.json();
            alert("Failed to fetch products: " + errorData.message);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("An error occurred while fetching products: " + error.message); // Display the error message
    } finally {
        hideSpinner();
    }
};

// Filter products based on selected category
const filterProductsByCategory = (category) => {
    let filteredProducts = [];

    if (category === 'All') {
        filteredProducts = allProducts; // Show all products
    } else {
        filteredProducts = allProducts.filter(product => product.category === category); // Filter by category
    }

    console.log(`Filtered Products for ${category}: `, filteredProducts);
    displayProducts(filteredProducts); // Display filtered products
};

const displayProducts = (products) => {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Clear any existing content

    if (products.length === 0) {
        productContainer.innerHTML = `
            <div class="text-center col-span-full">
                <h2 class="text-2xl font-semibold text-gray-700">No Products Available</h2>
                <p class="text-gray-600">Please check back later.</p>
            </div>
        `;
        return;
    }

    products.forEach((product) => {
        const div = document.createElement("div");
        div.className = "card bg-white shadow-md rounded-lg overflow-hidden";

        div.innerHTML = `
            <div class="p-4">
                <h2 class="text-xl font-bold mb-2">${product.name}</h2>
                <p class="text-gray-600">Category: ${product.category}</p>
                <p class="text-gray-600">Price: $${product.price}</p>
                <p class="text-gray-600">Stock Quantity: ${product.stock_quantity}</p>
               
                <div class="flex justify-between mt-4">
                    <!-- Buttons and quantity input -->
                    <button class="btn btn-secondary" onclick="decrementQuantity(${product.product_id})">-</button>
                    <input type="number" id="quantity-${product.product_id}" class="input input-bordered w-20 text-center" value="1" min="1" max="${product.stock_quantity}">
                    <button class="btn btn-primary" onclick="incrementQuantity(${product.product_id}, ${product.stock_quantity})">+</button>
                </div>
                
                <div class="flex justify-center mt-4">
                    <button class="btn btn-primary" onclick="manualAddToCart(${product.product_id}, '${product.name}', ${product.price}, ${product.stock_quantity})">Add to Cart</button>
                </div>
            </div>
        `;

        productContainer.appendChild(div);
    });
};

// Increment the quantity in the number input box
const incrementQuantity = (productId, stockQuantity) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value);

    // Prevent quantity from exceeding stock quantity
    if (quantity < stockQuantity) {
        quantityInput.value = quantity + 1;
    }
};

// Decrement the quantity in the number input box
const decrementQuantity = (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value);

    // Prevent quantity from going below 1
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
};

// Add product to cart using the quantity in the input box
const manualAddToCart = (productId, productName, price, stockQuantity) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityInput.value);

    // Check if quantity exceeds stock available
    if (quantity > stockQuantity) {
        alert("Cannot add more than available stock.");
        return;
    }

    if (!cart[productId]) {
        cart[productId] = {
            name: productName,
            price: price,
            quantity: quantity,
            product_id: productId,
        };
    } else {
        cart[productId].quantity += quantity;
    }

    console.log("Updated Cart: ", cart);
    updateCartUI();
};

// Update cart UI
const updateCartUI = () => {
    const cartItems = document.getElementById("cart-items");
    const totalPriceDiv = document.getElementById("total-price");

    cartItems.innerHTML = "";
    let totalPrice = 0;

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = `<p>Your cart is empty</p>`;
        totalPriceDiv.innerHTML = `<p>Total: $0.00</p>`;
        return;
    }

    Object.values(cart).forEach(item => {
        const itemDiv = document.createElement("div");
        const itemTotal = item.quantity * item.price;
        totalPrice += itemTotal;

        itemDiv.innerHTML = `
            <p>${item.name} - ${item.quantity} x $${item.price} = $${itemTotal}</p>
        `;
        cartItems.appendChild(itemDiv);
    });

    totalPriceDiv.innerHTML = `<p>Total: $${totalPrice.toFixed(2)}</p>`;
};

// Buy Bag functionality
const selectBag = (bagType) => {
    let message;
    switch (bagType) {
        case "ClothBag":
            message = "You have chosen a Cloth Bag.";
            break;
        case "PlasticBag":
            message = "You have chosen a Plastic Bag.";
            break;
        case "Trolley":
            message = "You have chosen a Trolley.";
            break;
        case "NoBag":
            message = "You have chosen No Bag.";
            break;
        default:
            message = "Invalid bag type selected.";
    }
    alert(message);
};

// Handle purchase
const purchase = async () => {
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
        alert("You are not logged in. Please login to purchase.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    const purchaseProducts = Object.values(cart).map(item => ({
        id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
    }));

    console.log("Sending purchase request for: ", purchaseProducts);

    try {
        const res = await fetch("http://localhost:3000/api/buyProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ products: purchaseProducts }),
        });

        if (res.ok) {
            const data = await res.json();
            console.log("Purchase response: ", data);
            alert("Purchase successful!");

            // Store purchase details and seller info in localStorage
            const purchaseDetails = {
                products: purchaseProducts,
                totalPrice: data.totalPrice, // Assuming the response contains total price
                sellerInfo: data.sellerInfo, // Assuming the response contains seller info
                date: new Date().toLocaleString(), // Current date and time
            };

            localStorage.setItem("purchaseDetails", JSON.stringify(purchaseDetails)); // Store in localStorage

            // Clear cart after successful purchase
            cart = {};
            updateCartUI(); // Update cart UI

            // Redirect to memo.html to display purchase memo
            window.location.href = "memo.html";
        } else {
            const errorData = await res.json();
            alert(`Purchase failed: ${errorData.message || "Unknown error."}`);
        }
    } catch (error) {
        alert("Error during purchase.");
        console.error("Purchase Error:", error);
    }
};

// Initial fetch of products
fetchProducts();