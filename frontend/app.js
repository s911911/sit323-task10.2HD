// Firebase v8 初始化
const firebaseConfig = {
    apiKey: "AIzaSyDeYE-8sAS8c-_IIKDAIiIqOj06IOO6a5Y",
    authDomain: "human-detection-a3e60.firebaseapp.com",
    databaseURL: "http://127.0.0.1:9001/?ns=human-detection-a3e60",
    projectId: "human-detection-a3e60"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Realtime Database 监听
  const dbRef = firebase.database().ref("health/latest");
  
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      document.getElementById("heartRate").textContent = data.heartRate ?? "--";
      document.getElementById("steps").textContent = data.steps ?? "--";
      document.getElementById("lastUpdated").textContent = data.lastSeen ?? "--";
      console.log("✅ Data received:", data);
    } else {
      console.log("⚠️ No data found at health/latest");
    }
  });





 

  