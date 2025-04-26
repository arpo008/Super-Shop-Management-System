document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the "Get Graph" button
    document.getElementById('getGraphBtn').addEventListener('click', async function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Validate that both start and end dates are selected
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        try {
            // Fetch data from the API
            const response = await fetch('http://localhost:3000/api/getAllSales', {
                method: 'POST', // Use POST since we're sending data
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Include auth token
                },
                body: JSON.stringify({ start_date: startDate, end_date: endDate }) // Send JSON data
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse);
                throw new Error('Failed to fetch sales data');
            }

            // Parse the response data
            const data = await response.json();
            console.log('Data received from API:', data);

            // Check if sales data is available
            if (!data.sales || data.sales.length === 0) {
                alert('No sales data available for the selected date range.');
                return;
            }

            // Prepare data for the graph
            const categories = data.sales.map(item => item.date); // Dates for the X-axis
            const values = data.sales.map(item => item.sales); // Sales values for the Y-axis

            // Prepare the chart options
            const options = {
                series: [{
                    name: 'Sales',
                    data: values
                }],
                chart: {
                    type: 'line',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: categories
                },
                title: {
                    text: 'Sales Data',
                    align: 'center'
                }
            };

            // Create a new chart instance with the options
            const chart = new ApexCharts(document.querySelector("#bar-chart"), options);

            // Clear the existing chart before rendering a new one
            document.querySelector("#bar-chart").innerHTML = "";

            // Render the chart
            chart.render();

        } catch (error) {
            console.error('Error fetching or rendering the graph:', error);
            alert('An error occurred while fetching the data. Please try again.');
        }
    });
});
