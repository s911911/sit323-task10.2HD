const chartCtx = document.getElementById("chart").getContext("2d");

const chart = new Chart(chartCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Heart Rate (bpm)",
      data: [],
      borderColor: "#f44336",
      backgroundColor: "rgba(244,67,54,0.2)",
      fill: true,
      tension: 0.3
    }]
  }
});

async function loadLatestData() {
  try {
    const res = await fetch("/health/latest");
    const data = await res.json();
    document.getElementById("heartRate").textContent = data.heartRate ?? "--";
    document.getElementById("steps").textContent = data.steps ?? "--";
    document.getElementById("lastUpdated").textContent = new Date(data.timestamp).toLocaleString() ?? "--";
    if (data.heartRate !== undefined) {
      updateChart(new Date(data.timestamp).toLocaleTimeString(), data.heartRate);
    }
  } catch (err) {
    console.error("Error loading latest data:", err);
  }
}

async function loadHistoryChart() {
  try {
    const res = await fetch("/health/history");
    const data = await res.json();
    const historyListEl = document.getElementById("historyList");
    historyListEl.innerHTML = "";
    data.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "history-card";
      div.innerHTML = `
        <p>❤️ Heart Rate: <strong>${entry.heartRate}</strong> bpm</p>
        <p>👣 Steps: <strong>${entry.steps}</strong></p>
        <p>🕒 Time: ${new Date(entry.timestamp).toLocaleString()}</p>
        <hr/>
      `;
      historyListEl.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading history:", err);
  }
}

function updateChart(label, value) {
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(value);
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.style.display = "none");
  document.getElementById(page).style.display = "block";
  if (page === 'dashboard') loadLatestData();
  if (page === 'history') loadHistoryChart();
}

function applyTheme() {
  const selected = document.getElementById("themeSelect").value;
  const main = document.querySelector(".main-content");
  switch (selected) {
    case "light":
      main.style.background = "linear-gradient(to right, #e3f2fd, #fce4ec)";
      break;
    case "dark":
      main.style.background = "#1e1e2f";
      break;
    case "pink":
      main.style.background = "linear-gradient(to right, #f8bbd0, #fce4ec)";
      break;
  }
}

showPage("dashboard");
loadLatestData();
