import fetch from 'node-fetch';

const API_URL = process.env.API_URL;

async function insertHistoryBatch() {
  console.log("📦 Inserting historical data...");
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    const data = {
      heartRate: Math.floor(Math.random() * 40) + 60,
      steps: Math.floor(Math.random() * 300 + 100),
      timestamp
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      console.log(`✅ History ${24 - i}h ago inserted:`, result);
    } catch (err) {
      console.error("❌ Error inserting history:", err.message);
    }
  }
}

async function startRealtimeData() {
  console.log("📡 Starting realtime data stream...");
  setInterval(async () => {
    const data = {
      heartRate: Math.floor(Math.random() * 40) + 60,
      steps: Math.floor(Math.random() * 300 + 100),
      timestamp: new Date().toISOString()
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      console.log("📥 Realtime:", result);
    } catch (err) {
      console.error("❌ Error inserting realtime:", err.message);
    }
  }, 5000);
}

(async () => {
  await insertHistoryBatch();
  await startRealtimeData();
})();
