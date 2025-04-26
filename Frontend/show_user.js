// Check if the user is authenticated
if (!localStorage.getItem('auth_token')) {
    alert('Login First');
    window.location.href = 'login.html'; // Redirect to login page
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    const userDetailsDiv = document.getElementById("userDetailsBody");
    const errorMessage = document.getElementById("errorMessage");

    if (!userId) {
        errorMessage.innerText = "User  ID is missing.";
        errorMessage.classList.remove("hidden");
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
            const user = result.user;

            userDetailsDiv.innerHTML = `
                <tr>
                    <td class="py-3 px-5 border-b"><strong>User ID:</strong></td>
                    <td class="py-3 px-5 border-b">${user.user_id}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>First Name:</strong></td>
                    <td class="py-3 px-5 border-b">${user.first_name}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Last Name:</strong></td>
                    <td class="py-3 px-5 border-b">${user.last_name}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Address:</strong></td>
                    <td class="py-3 px-5 border-b">${user.address}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Gender:</strong></td>
                    <td class="py-3 px-5 border-b">${user.gender}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Date of Birth:</strong></td>
                    <td class="py-3 px-5 border-b">${new Date(user.dob).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Telephone:</strong></td>
                    <td class="py-3 px-5 border-b">${user.telephone}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Age:</strong></td>
                    <td class="py-3 px-5 border-b">${user.age}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Salary:</strong></td>
                    <td class="py-3 px-5 border-b">$${parseFloat(user.salary).toFixed(2)}</td>
                </tr>
                <tr>
                    <td class="py-3 px-5 border-b"><strong>Role:</strong></td>
                    <td class="py-3 px-5 border-b">${user.role}</td>
                </tr>
            `;
        } else {
            errorMessage.innerText = result.message;
            errorMessage.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        errorMessage.innerText = "An error occurred while fetching user details.";
        errorMessage.classList.remove("hidden");
    }
});

// Function to go back to the search page
function goBack() {
    window.location.href = 'find_user.html'; //
}