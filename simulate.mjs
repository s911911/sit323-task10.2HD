import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// ✅ 替换为你的 firebaseConfig（与你 frontend/app.js 中一致）
const firebaseConfig = {
  apiKey: "AIzaSyDeYE-8sAS8c-_IIKDAIiIqOj06IOO6a5Y",
  authDomain: "human-detection-a3e60.firebaseapp.com",
  databaseURL: "http://127.0.0.1:9001/?ns=human-detection-a3e60", // ✅ 非常重要
  projectId: "human-detection-a3e60",
  storageBucket: "human-detection-a3e60.appspot.com",
  messagingSenderId: "265206723206",
  appId: "1:265206723206:web:adb749a4e4b45740ebd707"
};


const app = initializeApp(firebaseConfig, {
  databaseURL: "http://127.0.0.1:9000/?ns=your-local-namespace"
});
const db = getDatabase(app);

function pushData() {
  const now = new Date().toISOString();
  const data = {
    heartRate: Math.floor(60 + Math.random() * 100),
    steps: Math.floor(1000 + Math.random() * 5000),
    lastSeen: now
  };

  set(ref(db, "health/latest"), data)
    .then(() => console.log("✅ Pushed:", data))
    .catch(console.error);
}

setInterval(pushData, 5000);
