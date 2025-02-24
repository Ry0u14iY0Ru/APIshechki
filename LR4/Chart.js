function displayResults(data) {
    let resultsHTML = '<h2>Результаты анализа:</h2>';

    if (data.response && data.response.entities) {
        // Формирование данных для графика
        const labels = data.response.entities.map(entity => entity.entityId);
        const scores = data.response.entities.map(entity => entity.relevanceScore || 0);

        var ctx = document.createElement('canvas');
        document.getElementById('results').appendChild(ctx);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Уверенность по объектам',
                    data: scores,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        resultsHTML += '<p>Нет данных для отображения.</p>';
    }

    document.getElementById('results').innerHTML = resultsHTML;
}
