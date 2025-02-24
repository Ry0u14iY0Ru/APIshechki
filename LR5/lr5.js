document.getElementById('fetchData').addEventListener('click', async function() {
    const currency = document.getElementById('currency').value;
    const days = parseInt(document.getElementById('days').value);

    if (days < 1 || days > 30) {
        alert("Пожалуйста, выберите период от 1 до 30 дней.");
        return;
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${currency}/market_chart?vs_currency=usd&days=${days}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Полученные данные:", data);

        if (!data.prices || data.prices.length === 0) {
            alert("Не удалось получить данные о ценах.");
            return;
        }

        const labels = data.prices.map(price => {
            const date = new Date(price[0]);
            return date.toLocaleDateString();
        });

        const prices = data.prices.map(price => price[1]);

        const ctx = document.getElementById('myChart').getContext('2d');

        if (window.myChart && window.myChart instanceof Chart) {
            console.log("Удаление предыдущего графика...");
            window.myChart.destroy(); // Удаляем предыдущий график
        } else {
            console.log("myChart не найден или не является экземпляром Chart.");
        }

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Цена ${currency.charAt(0).toUpperCase() + currency.slice(1)} (USD)`,
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Цена (USD)',
                        },
                        beginAtZero: false
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Дата',
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при получении данных о ценах.\n' + error.message);
    }
});
