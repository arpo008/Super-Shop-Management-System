document.addEventListener("DOMContentLoaded", function () {
    const attendanceData = JSON.parse(localStorage.getItem("attendanceData"));

    if (!attendanceData || attendanceData.length === 0) {
        alert("No attendance data found.");
        return;
    }

    const tableBody = document.getElementById("attendanceTableBody");

    // Loop through the attendance data and create table rows
    attendanceData.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.user_id}</td>
            <td>${new Date(entry.date).toLocaleDateString()}</td>
            <td>${entry.clock_in_time ? new Date(entry.clock_in_time).toLocaleTimeString() : "Not Clocked In"}</td>
            <td>${entry.clock_out_time ? new Date(entry.clock_out_time).toLocaleTimeString() : "Not Clocked Out"}</td>
            <td>${entry.total_hours ? entry.total_hours : "N/A"}</td>
            <td>${entry.status || "N/A"}</td>
        `;
        tableBody.appendChild(row);
    });
});
