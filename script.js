async function plotChart(age, size, sex) {
  const response = await fetch("data.json");
  const data = await response.json();
  const filteredData = data.filter(entry => entry.sex === sex);

  const ages = filteredData.map(entry => entry.age);

  // Array of shades of red for the percentiles
  const greyShades = [
    "#212121", "#424242", "#616161", "#757575", "#9E9E9E", "#BDBDBD", "#EEEEEE"
  ];

  const percentileLabels = [
    "2.5th %ile", "10th %ile", "25th %ile", "50th %ile", "75th %ile", "90th %ile", "97.5th %ile"
  ];

  const datasets = ['p2_5', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97_5'].map((key, idx) => ({
    label: percentileLabels[idx],  // Corrected labels for percentiles
    data: filteredData.map(entry => entry[key]),
    borderColor: greyShades[idx],  // Use the red shades for percentiles
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
