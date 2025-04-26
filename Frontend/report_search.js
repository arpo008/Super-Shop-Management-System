async function searchReport() {
    const userId = parseInt(document.getElementById("userId").value, 10); // Ensure user_id is a number

    // Check if all required fields are filled
    if (!userId) {
        alert("Please fill in all fields.");
        return;
    }

    // Prepare request payload
    const requestPayload = {
        user_id: userId,
    };

    try {
        // Fetch report data from the backend API
        const response = await fetch("http://localhost:3000/api/getReport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();

        // Check if the API response is successful and handle accordingly
        if (response.ok && data.message === "Report Found") {
            // Store the fetched data in localStorage to use on the next page
            localStorage.setItem("reportData", JSON.stringify(data.Reports));
            // Redirect to report_display.html to show the data
            window.location.href = "report_display.html";
        } else {
            alert(data.message || "No report data found.");
        }
    } catch (error) {
        console.error("Error fetching report data:", error);
        alert("An error occurred while fetching report data.");
    }
}
