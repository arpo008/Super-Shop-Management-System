// Function to handle increment submission
async function addIncrement() {
    // Get input values from the form
    const userId = document.getElementById("userId").value;
    const increment = document.getElementById("increment").value;

    // Validate input
    if (!userId || !increment) {
        alert("Please fill in both fields.");
        return;
    }

    const payload = {
        user_id: parseInt(userId, 10),
        increment: parseFloat(increment)
    };

    try {
        // Define the API URL
        const apiUrl = "http://localhost:3000/api/addIncrement";

        // Retrieve the token from localStorage
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
            alert("You must be logged in to perform this action.");
            return;
        }

        // Send POST request
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}` // Include the token in headers
            },
            body: JSON.stringify(payload)
        });

        // Handle response
        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Increment added successfully.");
            window.location.href="increment_salary.html";
        } else {
            alert(result.message || "An error occurred.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
    }
}
