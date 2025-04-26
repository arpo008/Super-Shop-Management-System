document.getElementById('performanceForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const API_URL = 'http://localhost:3000/api/submitPerformance';

    // Retrieve the auth_token from localStorage
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
        alert('You must be logged in to submit a report.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    // Get input values from the form
    const employeeId = parseInt(document.getElementById('employeeId').value.trim());
    const score = parseInt(document.getElementById('score').value.trim());
    const comments = document.getElementById('comments').value.trim();

    // Validate inputs
    if (isNaN(employeeId) || employeeId <= 0) {
        alert('Invalid Employee ID. Please enter a valid number.');
        return;
    }

    if (isNaN(score) || score < 0 || score > 100) {
        alert('Invalid Score. Please enter a number between 0 and 100.');
        return;
    }

    if (!comments) {
        alert('Comments cannot be empty.');
        return;
    }

    try {
        // Prepare the data to send
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, // Include the token in headers
            },
            body: JSON.stringify({
                user_id: employeeId, // Assuming backend automatically handles user association
                score: score,
                comment: comments,
            }),
        });

        const result = await response.json();

        // Handle the backend response
        if (response.ok) {
            alert(result.message); // Show success message
        } else {
            // Handle error responses from backend
            if (result.message && result.message.includes("jwt expired")) {
                alert('Your session has expired. Please log in again.');
                window.location.href = 'performance.html'; // Redirect to login page
            } else {
                alert('Error: ' + result.message); // Show error message from backend
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
