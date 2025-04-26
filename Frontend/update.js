document.querySelector('#updateForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = parseInt(document.querySelector('#id').value, 10);
    const category = document.querySelector('#category').value;
    const name = document.querySelector('#name').value;
    const price = parseFloat(document.querySelector('#price').value);
    const quantity = parseInt(document.querySelector('#quantity').value, 10);

   

    if (!id || !category || !name || !price || !quantity) {
        alert('Please fill in all the required fields.');
        return;
    }

    const payload = { id, category, name, price, quantity };
    console.log('Payload being sent:', JSON.stringify(payload));

    // Create a FormData object
    const formData = new FormData();
    formData.append('id', id);          // Append ID
    formData.append('category', category);  // Append category
    formData.append('name', name);     // Append name
    formData.append('price', price);   // Append price
    formData.append('quantity', quantity); // Append quantity


    const API_URL = 'http://localhost:3000/api/updateProduct';
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
        alert('Authorization token is missing. Please login first.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST', // Use PUT for updates
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (response.ok) {
            alert(`Product with ID ${data.product_id} has been updated.`);
            window.location.href="update.html"
        } else {
            alert('Error: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
        alert('An error occurred. Please check the console for more details.');
    }
});
