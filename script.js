let data = [];

window.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("data.json");
  data = await response.json();

  document.getElementById("kidneyForm").addEventListener("submit", handleSubmit);
});

function handleSubmit(event) {
  event.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const size = parseFloat(document.getElementById("size").value);
  const sex = document.querySelector('input[name="sex"]:checked').value;

  const match = data.find(row => row.age === age && row.sex === sex);

  if (!match) {
    document.getElementById("result").textContent = "No data available for this age and sex.";
    return;
  }

  const percentiles = [
    { label: "2.5th", value: match.p2_5 },
    { label: "10th", value: match.p10 },
    { label: "25th", value: match.p25 },
    { label: "50th", value: match.p50 },
    { label: "75th", value: match.p75 },
    { label: "90th", value: match.p90 },
    { label: "97.5th", value: match.p97_5 },
  ];

  const percentile = getPercentile(size, percentiles);

  document.getElementById("result").textContent = `Your kidney size is at the ~${percentile} percentile for a ${sex === 'M' ? 'male' : 'female'} age ${age}.`;

  renderChart(percentiles, size);
}

function getPercentile(size, percentiles) {
  for (let i = 0; i < percentiles.length - 1; i++) {
    const current = percentiles[i];
    const next = percentiles[i + 1];
    if (size < current.value) return current.label;
    if (size >= current.value && size < next.value) {
      return `${current.label}–${next.label}`;
    }
  }
  return size >= percentiles[percentiles.length - 1].value ? "above 97.5th" : "below 2.5th";
}

let chart;
function renderChart(percentiles, size) {
  const ctx = document.getElementById("chart").getContext("2d");

  const labels = percentiles.map(p => p.label);
  const values = percentiles.map(p => p.value);

  const datasets = [
    {
      label: "Kidney size percentiles",
      data: values,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 1)",
      fill: false,
      tension: 0.3,
    },
    {
      label: "Your kidney size",
      data: Array(percentiles.length).fill(null).map((_, i) => (i === 3 ? size : null)),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      pointRadius: 6,
      type: 'line',
      fill: false,
    }
  ];

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        y: {
          title: { display: true, text: "Kidney Size (cm)" }
        }
      }
    }
  });
}