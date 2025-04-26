window.onload = async function() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        alert('No token found. Redirecting to login.');
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }

    console.log("Token:", token);  // Debugging: Check if token is stored correctly

    try {
        const response = await fetch('http://localhost:3000/myData', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Log the full response to see if there are any errors
        console.log('Response Status:', response.status);  // Log status code
        console.log('Response Headers:', response.headers);  // Log response headers

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error Data:', errorData);  // Log error response from server
            alert('Failed to fetch user data: ' + errorData.message);
            window.location.href = 'login.html'; // Redirect to login if fetching user data fails
            return;
        }

        const userData = await response.json();
        console.log("User Data:", userData); // Debugging: Log user data

        // Hide elements based on role
        const userRole = userData.Data.role;
        if (userRole !== 'Admin') {
            document.querySelector('.admin-card').style.display = 'none';
        }
        if (userRole !== 'HR Manager') {
            document.querySelector('.hr-manager-card').style.display = 'none';
        }
        if (userRole !== 'Product Manager') {
            document.querySelector('.product-manager-card').style.display = 'none';
        }
        if (userRole !== 'Shop Manager') {
            document.querySelector('.shop-manager-card').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);  // Log the actual error
        alert('An error occurred while fetching user data. Please try again later.');
        window.location.href = 'login.html'; // Redirect to login on error
    }
};

function logout() {
    localStorage.removeItem('auth_token');
    window.location.href = 'login.html'; // Redirect to login on logout
}
