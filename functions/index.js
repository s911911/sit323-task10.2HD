const {onValueWritten} = require("firebase-functions/v2/database");
const {initializeApp} = require("firebase-admin/app");
const {getDatabase} = require("firebase-admin/database");

// 初始化 Admin SDK
initializeApp();
const db = getDatabase();

// Cloud Function 逻辑
exports.detectAnomalies = onValueWritten("/health/latest", async (event) => {
  try {
    const data = event.data.after.val();
    if (!data) return null;

    const thresholdsSnap = await db.ref("settings/thresholds").once("value");
    const thresholds = thresholdsSnap.val();
    if (!thresholds) return null;

    const {minHeartRate, maxHeartRate, stepGoal} = thresholds;
    const {heartRate, steps} = data;

    if (heartRate < minHeartRate) {
      console.log(`🔵 Heart rate too LOW: ${heartRate} < ${minHeartRate}`);
    } else if (heartRate > maxHeartRate) {
      console.log(`🔴 Heart rate too HIGH: ${heartRate} > ${maxHeartRate}`);
    }

    if (steps < stepGoal) {
      console.log(`🟠 Steps too LOW: ${steps} < ${stepGoal}`);
    }
  } catch (err) {
    console.error("❌ Function error:", err);
  }

  return null;
});
