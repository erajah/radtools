async function plotChart(age, size, sex) {
  const response = await fetch("data.json");
  const data = await response.json();
  const filteredData = data.filter(entry => entry.sex === sex);

  const ages = filteredData.map(entry => entry.age);

  // Array of shades of red for the percentiles
  const redShades = [
    "#ff0000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc", "#ffb3b3", "#ff8080"
  ];

  const datasets = ['p2_5', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97_5'].map((key, idx) => ({
    label: `${[2.5, 10, 25, 50, 75, 90, 97.5][idx]}th %ile`,  // Update labels
    data: filteredData.map(entry => entry[key]),
    borderColor: redShades[idx],  // Use the red shades for percentiles
    fill: false,
    tension: 0.3
  }));

  // Prepare user input data
  const userData = new Array(ages.length).fill(null);
  const closestIndex = ages.reduce((prevIdx, currAge, idx) =>
    Math.abs(currAge - age) < Math.abs(ages[prevIdx] - age) ? idx : prevIdx, 0);
  userData[closestIndex] = size;

  datasets.push({
    label: "User Input",
    data: userData,
    borderColor: "red",
    backgroundColor: "red",
    pointRadius: 6,
    pointBackgroundColor: "red",
    fill: false,
    showLine: false
  });

  const ctx = document.getElementById("chart").getContext("2d");
  if (window.kidneyChart) window.kidneyChart.destroy();

  window.kidneyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ages,
      datasets: datasets
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Age (years)" }
        },
        y: {
          title: { display: true, text: "Kidney Size (cm)" }
        }
      }
    }
  });
}

window.onload = () => {
  document.getElementById("kidneyForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const age = parseFloat(document.getElementById("age").value);
    const size = parseFloat(document.getElementById("size").value);
    const sex = document.querySelector('input[name="sex"]:checked').value;
    if (!sex || isNaN(age) || isNaN(size)) return;
    await plotChart(age, size, sex);
  });
};
