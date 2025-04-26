document.querySelector('button[type="submit"]').addEventListener('click', async (event) => {
    event.preventDefault();
  
    const API_URL = 'http://localhost:3000/api/login';
    const user_id = document.querySelector('#user_id').value;
    const password = document.querySelector('#password').value;
  
    if (!user_id || !password) {
      alert('Please enter both User ID and Password.');
      return;
    }
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Login successful!');
        localStorage.setItem('auth_token', data.web_tokens); // Save token
        fetchUserRole(); // Fetch user role after login
      } else {
        const errorData = await response.json();
        alert('Login failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  });
  
  // Fetch the user role after login to redirect based on role
  async function fetchUserRole() {
    const API_URL = 'http://localhost:3000/api/myData';
    const authToken = localStorage.getItem('auth_token');
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const role = data.Data.role;
        
        // Redirect based on user role
        if (role === 'Admin') {
          window.location.href = 'Admin.html';
        } else if (role === 'HR Manager') {
          window.location.href = 'HR_manager.html';
        } else if (role === 'Product Manager') {
          window.location.href = 'product_Manager.html';
        } else if (role === 'Shop Manager') {
          window.location.href = 'shop_Manager.html';
        } else if (role === 'Seller') {
            window.location.href = 'employee.html';
        } else {
          alert('Unauthorized role. Access denied.');
        }
      } else {
        alert('Failed to fetch user data.');
      }
    } catch (error) {
      alert('An error occurred while fetching user data.');
    }
  }
  