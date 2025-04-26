// Check if the user is authenticated
if (!localStorage.getItem('auth_token')) {
    alert('Login First');
    window.location.href = 'login.html'; // Redirect to login page
}

document.getElementById("searchButton").addEventListener("click", async () => {
    const userId = document.getElementById("userIdInput").value;
    const errorMessage = document.getElementById("errorMessage");

    if (!userId) {
        alert("Please enter a User ID.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/findUser ", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('auth_token')}` // Include token in request
            },
            body: JSON.stringify({ user_id: parseInt(userId) })
        });

        const result = await response.json();

        if (response.ok) {
            // Redirect to show_user.html with user ID
            window.location.href = `show_user.html?user_id=${userId}`;
        } else {
            errorMessage.innerText = result.message;
            errorMessage.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred while searching for the user.");
    }
});