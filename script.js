// Function to calculate and plot the chart
async function plotChart(age, size, sex) {
  // Fetch and parse the data from the JSON file
  const response = await fetch("data.json");
  const data = await response.json();

  // Filter the data based on the selected age and sex
  const filteredData = data.filter(entry => entry.age === age && entry.sex === sex)[0];

  if (!filteredData) {
    alert("No data found for the selected age and sex.");
    return;
  }

  // Prepare the labels for the X-axis (ages for the sex chosen)
  const ages = data.filter(entry => entry.sex === sex).map(entry => entry.age);

  // Extract percentiles data for the Y-axis (kidney size in cm)
  const p2_5 = data.filter(entry => entry.sex === sex).map(entry => entry.p2_5);
  const p10 = data.filter(entry => entry.sex === sex).map(entry => entry.p10);
  const p25 = data.filter(entry => entry.sex === sex).map(entry => entry.p25);
  const p50 = data.filter(entry => entry.sex === sex).map(entry => entry.p50);
  const p75 = data.filter(entry => entry.sex === sex).map(entry => entry.p75);
  const p90 = data.filter(entry => entry.sex === sex).map(entry => entry.p90);
  const p97_5 = data.filter(entry => entry.sex === sex).map(entry => entry.p97_5);

  // Create the chart using Chart.js
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ages,
      datasets: [
        {
          label: '2.5th Percentile',
          data: p2_5,
          borderColor: 'rgba(59, 130, 246, 0.7)',
          fill: false,
          tension: 0.1
        },
        {
          label: '10th Percentile',
          data: p10,
          borderColor: 'rgba(34, 197, 94, 0.7)',
          fill: false,
          tension: 0.1
        },
        {
          label: '25th Percentile',
          data: p25,
          borderColor: 'rgba(251, 146, 60, 0.7)',
          fill: false,
          tension: 0.1
        },
        {
          label: '50th Percentile',
          data: p50,
          borderColor: 'rgba(34, 197, 94, 1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '75th Percentile',
          data: p75,
          borderColor: 'rgba(251, 146, 60, 1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '90th Percentile',
          data: p90,
          borderColor: 'rgba(59, 130, 246, 1)',
          fill: false,
          tension: 0.1
        },
        {
          label: '97.5th Percentile',
          data: p97_5,
          borderColor: 'rgba(15, 23, 42, 1)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'User Input',
          data: [size], // Plot the user's kidney size
          borderColor: 'red',
          backgroundColor: 'red',
          pointRadius: 6,
          pointBackgroundColor: 'red',
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Age (years)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Kidney Size (cm)'
          },
          beginAtZero: false,
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.raw + ' cm';
            }
          }
        }
      }
    }
  });
}

// Function to handle form submission and invoke the plot
async function handleSubmit(event) {
  event.preventDefault();
  
  // Get the user input values
  const age = parseInt(document.getElementById("age").value);
  const size = parseFloat(document.getElementById("size").value);
  const sex = document.querySelector('input[name="sex"]:checked').value;

  // Validate the input values
  if (isNaN(age) || isNaN(size) || !sex) {
    alert("Please fill in all the fields correctly.");
    return;
  }

  // Display the result text
  const result = document.getElementById("result");
  result.textContent = `Your kidney size: ${size} cm for Age: ${age} years and Sex: ${sex === 'M' ? 'Male' : 'Female'}`;

  // Plot the chart
  await plotChart(age, size, sex);
}

// Add event listener for form submission
document.getElementById("kidneyForm").addEventListener("submit", handleSubmit);
