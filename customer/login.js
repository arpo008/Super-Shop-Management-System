document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission

  const formData = new FormData(e.target);
  const body = Object.fromEntries(formData.entries());

  // Check if email and password are provided in the form
  if (!body.email || !body.password) {
      alert('Please enter both email and password');
      return;
  }

  try {
      const res = await fetch('http://localhost:3000/api/customer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body), // Send the form data as JSON
      });

      // Check if the response is OK
      if (!res.ok) {
          const data = await res.json();
          alert(data.message || 'Login failed');
          return;
      }

      const data = await res.json();
      // Check if the response contains the token
      if (data.web_tokens) {
        localStorage.setItem('auth_token', data.web_tokens); // Store the token in localStorage
          alert(data.message); // Show the success message
          window.location.href = 'index.html'; // Redirect to another page
      } else {
          alert('Login failed, no token received');
      }
  } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
  }
});
