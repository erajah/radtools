
async function fetchData() {
    const response = await fetch('kidney_children.json');
    return await response.json();
}

function getPercentiles(data, age, sex) {
    return data.find(d => d.age === age && d.sex === sex);
}

function determinePercentile(userValue, percentiles) {
    const keys = ['p2_5', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97_5'];
    for (let i = 0; i < keys.length; i++) {
        if (userValue < percentiles[keys[i]]) {
            return keys[i];
        }
    }
    return 'Above 97.5th';
}

function plotChart(percentiles, userValue) {
    const labels = ['2.5th', '10th', '25th', '50th', '75th', '90th', '97.5th'];
    const values = [percentiles.p2_5, percentiles.p10, percentiles.p25, percentiles.p50,
                    percentiles.p75, percentiles.p90, percentiles.p97_5];

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Normative Percentiles',
                data: values,
                borderColor: 'blue',
                fill: false
            }, {
                label: 'Your Value',
                data: Array(labels.length).fill(null).map((_, i) => i === 3 ? userValue : null),
                borderColor: 'red',
                backgroundColor: 'red',
                pointRadius: 5,
                type: 'line',
                fill: false,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Kidney Length (cm)'
                    }
                }
            }
        }
    });
}

document.getElementById('input-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const age = parseInt(document.getElementById('age').value);
    const sex = document.getElementById('sex').value;
    const size = parseFloat(document.getElementById('size').value);

    const data = await fetchData();
    const percentiles = getPercentiles(data, age, sex);
    if (!percentiles) {
        alert('No data available for this age and sex.');
        return;
    }

    const percentile = determinePercentile(size, percentiles);
    alert('Your value is below the ' + percentile + ' percentile');
    plotChart(percentiles, size);
});
