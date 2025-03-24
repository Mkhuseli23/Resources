document.addEventListener('DOMContentLoaded', function() {
    // Example data (replace this with actual data from your backend or database)
    const resourceTypes = ['PDF', 'Video', 'Image', 'Text'];
    const resourceCounts = [25, 15, 5, 30];

    const categoryLabels = ['Books', 'Tutorials', 'Courses', 'Research Papers'];
    const categoryCounts = [15, 10, 10, 5];

    // Pie Chart for Resource Types
    const resourceTypeChartCtx = document.getElementById('resourceTypeChart').getContext('2d');
    const resourceTypeChart = new Chart(resourceTypeChartCtx, {
        type: 'pie',
        data: {
            labels: resourceTypes,
            datasets: [{
                data: resourceCounts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
                hoverBackgroundColor: ['#FF5A5F', '#36A2FB', '#FFB159', '#80C78F'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });

    // Bar Chart for Resource Distribution by Category
    const categoryChartCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryChart = new Chart(categoryChartCtx, {
        type: 'bar',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Number of Resources',
                data: categoryCounts,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

function handleLogout() {
    // Implement logout logic (e.g., Firebase Auth sign out)
    console.log('Logging out...');
}
