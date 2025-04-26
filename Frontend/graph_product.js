document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getGraphBtn').addEventListener('click', async function () {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const product_id = document.getElementById('id').value;

        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        if (!product_id || isNaN(product_id)) {
            alert("Please enter a valid Product ID.");
            return;
        }

        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/getProductSale', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                    id: Number(product_id),
                })
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error response from API:', errorResponse);
                alert(`Failed to fetch sales data: ${errorResponse.message || 'Unknown error'}`);
                return;
            }

            const data = await response.json();
            console.log('Data received from API:', data);

            if (!data.sales || data.sales.length === 0) {
                console.warn('No sales data received:', data);
                alert('No sales data available for the selected date range.');
                return;
            }

            const categories = data.sales.map(item => item.date);
            const salesValues = data.sales.map(item => item.sales);
            const productName = data.sales[0]?.product_name || "Product";

            const options = {
                series: [{
                    name: `Sales (${productName})`,
                    data: salesValues
                }],
                chart: {
                    type: 'line',
                    height: 350
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: categories,
                    title: { text: 'Dates' }
                },
                yaxis: {
                    title: { text: 'Sales Amount (TK)' }
                },
                title: {
                    text: `Sales Data for Product: ${productName}`,
                    align: 'center'
                },
                tooltip: {
                    shared: true,
                    intersect: false, // Prevent conflict
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        const { quantity_sold, sales } = data.sales[dataPointIndex];
                        return `
                            <div style="padding: 10px; background: white; border: 1px solid #ccc;">
                                <strong>Date:</strong> ${categories[dataPointIndex]}<br>
                                <strong>Quantity Sold:</strong> ${quantity_sold}<br>
                                <strong>Sales:</strong> TK ${sales}
                            </div>
                        `;
                    }
                }
            };
            

            document.querySelector("#bar-chart").innerHTML = "";
            const chart = new ApexCharts(document.querySelector("#bar-chart"), options);
            chart.render();

        } catch (error) {
            console.error('Error fetching or rendering the graph:', error);
            alert('An error occurred while fetching the data. Please try again.');
        }
    });
});
