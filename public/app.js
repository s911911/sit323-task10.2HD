// Firebase v8 初始化
const firebaseConfig = {
  apiKey: "AIzaSyDeYE-8sAS8c-_IIKDAIiIqOj06IOO6a5Y",
  authDomain: "human-detection-a3e60.firebaseapp.com",
  databaseURL: "http://localhost:9001?ns=human-detection-a3e60",
  projectId: "human-detection-a3e60"
};

firebase.initializeApp(firebaseConfig);

// 获取引用
const dbRef = firebase.database().ref("health/latest");

// 初始化图表
const ctx = document.getElementById("chart").getContext("2d");
const heartRateData = {
  labels: [],
  datasets: [{
    label: "Heart Rate (bpm)",
    data: [],
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    borderWidth: 2,
    fill: false,
    tension: 0.2
  }]
};
const chart = new Chart(ctx, {
  type: "line",
  data: heartRateData,
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time"
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Heart Rate"
        }
      }
    }
  }
});

// 图表更新函数
function updateChart(timestamp, rate) {
  if (heartRateData.labels.length >= 10) {
    heartRateData.labels.shift();
    heartRateData.datasets[0].data.shift();
  }
  heartRateData.labels.push(timestamp.slice(11, 19)); // 仅显示时:分:秒
  heartRateData.datasets[0].data.push(rate);
  chart.update();
}

// 监听数据库变化
dbRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const heartRateEl = document.getElementById("heartRate");
    const heartRateCard = heartRateEl.parentElement;

    heartRateEl.textContent = data.heartRate ?? "--";
    if (thresholdSettings.minHeartRate !== null && thresholdSettings.maxHeartRate !== null) {
    if (data.heartRate < thresholdSettings.minHeartRate || data.heartRate > thresholdSettings.maxHeartRate) {
      heartRateCard.classList.add("warning");
    } else {
      heartRateCard.classList.remove("warning");
      }
    }

// 异常心率判断与高亮提示
/*if (data.heartRate > 100) {
  heartRateCard.classList.add("warning");
} else {
  heartRateCard.classList.remove("warning");
}*/
    document.getElementById("steps").textContent = data.steps ?? "--";
    document.getElementById("lastUpdated").textContent = data.lastSeen ?? "--";
    updateChart(data.lastSeen, data.heartRate);
    console.log("📥 Data updated:", data);
  } else {
    console.warn("⚠️ No data found at health/latest");
  }
});



// 初始化历史图表
let historyChart;
function initHistoryChart() {
  const ctx = document.getElementById("historyChart").getContext("2d");
  historyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Heart Rate (bpm)",
        data: [],
        borderColor: "rgba(33, 150, 243, 1)",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: "Time" }
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Heart Rate" }
        }
      }
    }
  });
}

// 获取并绘制历史数据
function loadHistoryData() {
  const ref = firebase.database().ref("health/history");
  ref.once("value", (snapshot) => {
    const raw = snapshot.val();
    if (!raw) return;

    const entries = Object.entries(raw)
      .sort((a, b) => new Date(a[0]) - new Date(b[0])) // 按时间排序
      .slice(-24); // 只取最近 24 条

    const labels = entries.map(([ts, _]) => ts.slice(11, 16)); // 显示时:分
    const values = entries.map(([_, val]) => val.heartRate ?? 0);

    historyChart.data.labels = labels;
    historyChart.data.datasets[0].data = values;
    historyChart.update();
  });
}


function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.style.display = "none";
  });
  document.getElementById(pageId).style.display = "block";

  if (pageId === "dashboard") {
    loadThresholdsToDisplay();
  }

  if (pageId === "history") {
    if (!historyChart) initHistoryChart();
    loadHistoryData();
  }
}
