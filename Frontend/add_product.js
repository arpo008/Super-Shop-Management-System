document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#addProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.querySelector('#name').value.trim();
        const price = parseFloat(document.querySelector('#price').value);
        const category = document.querySelector('#category').value;
        const quantity = parseInt(document.querySelector('#quantity').value);

        // Validate inputs
        if (!name || isNaN(price) || !category || isNaN(quantity)) {
            alert('Please fill in all the fields.');
            return;
        }

        if (price < 0 || quantity < 0) {
            alert('Price and quantity must not be negative.');
            return;
        }

        // Prepare JSON data
        const jsonData = {
            name: name,
            price: price,
            category: category,
            quantity: quantity
        };
        for (const key in jsonData) {
            const value = jsonData[key];
            
            // Log the type of each value
            console.log(`${key}: ${typeof value}`);
          }
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('You must be logged in to add a product!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(jsonData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Product added successfully!');
                window.location.href = 'add_product.html';
            } else {
                alert(`Failed to add product: ${result.message}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred. Please try again.');
        }
    });

});
