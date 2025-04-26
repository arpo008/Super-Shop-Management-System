document.addEventListener("DOMContentLoaded", () => {
    const reportContainer = document.getElementById("reportTableBody");

    // Get report data from localStorage
    const reportData = JSON.parse(localStorage.getItem("reportData"));

    // Check if there is data to display
    if (reportData && Array.isArray(reportData)) {
        reportData.forEach(report => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="text-center font-bold text-gray-700">${report.report_id}</td>
                <td class="text-center font-bold text-gray-700">${report.reported_by}</td>
                <td class="text-center font-bold text-gray-700">${new Date(report.review_date).toLocaleDateString()}</td>
                <td class="text-center font-bold text-gray-700">${report.score}</td>
                <td class="text-center font-bold text-gray-700">${report.notes}</td>
            `;

            reportContainer.appendChild(row);
        });
    } else {
        // If no data is found
        const noDataMessage = document.createElement("tr");
        noDataMessage.innerHTML = `<td colspan="5" class="text-center text-red-500">No report data available.</td>`;
        reportContainer.appendChild(noDataMessage);
    }
});
