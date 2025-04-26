async function searchAttendance() {
    const userId = parseInt(document.getElementById("userId").value, 10); 
    const startingDate = document.getElementById("startingDate").value;
    const endingDate = document.getElementById("endingDate").value;

    // Check if all required fields are filled
    if (!userId || !startingDate || !endingDate) {
        alert("Please fill in all fields.");
        return;
    }

    // Prepare request payload
    const requestPayload = {
        user_id: userId,
        Starting: startingDate, 
        Ending: endingDate
    };

    try {
        // Fetch attendance data from the backend API
        const response = await fetch("http://localhost:3000/api/getAttendence", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();

        // Check if the API response is successful and handle accordingly
        if (response.ok && data.message !== "No data Found") {
            // Store the fetched data in localStorage to use on the next page
            localStorage.setItem("attendanceData", JSON.stringify(data.Attendence));
            // Redirect to attendance-display.html to show the table
            window.location.href = "attendance_display.html";
        } else {
            alert(data.message || "No attendance data found.");
        }
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        alert("An error occurred while fetching attendance data.");
    }
}
