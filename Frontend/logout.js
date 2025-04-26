function logout() {
    // Remove the auth_token from localStorage
    localStorage.removeItem('auth_token');
    
    // Optionally, you can add an alert or confirmation message
    alert('You have been logged out.');
    
    // Redirect to index.html (home page)
    window.location.href = "index.html";
}