const fetchSellerData = async () => {
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
        alert("You are not logged in. Please login to access this page.");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/myData", {
            method: "POST",
            headers: { Authorization: `Bearer ${authToken}` },
        });

        if (res.ok) {
            const data = await res.json();
            if (data && data.Data) {
                displaySellerInfo(data.Data);
            } else {
                alert("Seller data not found.");
            }
        } else {
            const errorData = await res.json();
            alert("Failed to fetch seller data: " + errorData.message);
        }
    } catch (error) {
        alert("An error occurred while fetching seller data: " + error.message);
    }
};

// Display seller information in the DOM
const displaySellerInfo = (sellerData) => {
    const sellerInfo = document.getElementById("seller-info");
    if (sellerInfo) {
        sellerInfo.innerHTML = `
            <p><strong>Name:</strong> ${sellerData.first_name} ${sellerData.last_name}</p>
            <p><strong>Address:</strong> ${sellerData.address}</p>
            <p><strong>Gender:</strong> ${sellerData.gender}</p>
            <p><strong>Phone:</strong> ${sellerData.telephone}</p>
            <p><strong>Role:</strong> ${sellerData.role}</p>
        `;
    }
};

// Display product purchase details
const purchaseDetails = JSON.parse(localStorage.getItem("purchaseDetails"));
const selectedBag = localStorage.getItem("selectedBag") || "No Bag"; // Fetch bag type from localStorage or default to "No Bag"

const displayProductDetails = () => {
    const productList = document.getElementById("product-list");
    if (!purchaseDetails) {
        productList.innerHTML = "<p>No purchase details available.</p>";
        return;
    }

    purchaseDetails.products.forEach((product) => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded-lg shadow-md";
        div.innerHTML = `
            <h3 class="text-xl font-semibold">${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
            <p>Total: $${(product.quantity * product.price).toFixed(2)}</p>
        `;
        productList.appendChild(div);
    });

    const bagInfoDiv = document.createElement("div");
    bagInfoDiv.className = "bg-white p-4 rounded-lg shadow-md";
    bagInfoDiv.innerHTML = `<p><strong>Bag Details:</strong> ${selectedBag}</p>`;
    productList.appendChild(bagInfoDiv);

    const totalDiv = document.createElement("div");
    totalDiv.className = "font-semibold text-lg mt-4";
    totalDiv.innerHTML = `<p>Total Purchase: $${purchaseDetails.totalPrice.toFixed(2)}</p>`;
    productList.appendChild(totalDiv);
};

// Redirect to the counter page
const goBack = () => {
    window.location.href = "counter.html";
};

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    fetchSellerData();
    if (purchaseDetails) {
        displayProductDetails();
    } else {
        console.error("Purchase details not found in localStorage.");
    }
});