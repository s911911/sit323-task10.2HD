const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

const mongoUri = process.env.MONGO_URI || "mongodb://mongodb:27017/healthdb";

// Schema
const healthSchema = new mongoose.Schema({
  heartRate: Number,
  steps: Number,
  timestamp: { type: Date, default: Date.now }
});
const Health = mongoose.model('Health', healthSchema);

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// JSON body parser
app.use(express.json());

// Serve static files from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 最新数据接口
app.get('/health/latest', async (req, res) => {
  try {
    const latest = await Health.findOne().sort({ timestamp: -1 });
    res.json(latest || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 插入数据接口
app.post('/health/insert', async (req, res) => {
  try {
    const { heartRate, steps, timestamp } = req.body;
    console.log("📨 Insert request body:", req.body);
    const record = new Health({
      heartRate,
      steps,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });
    await record.save();
    res.json({ status: 'ok', id: record._id });
  } catch (err) {
    console.error("❌ Insert failed:", err.message, err.stack);
    res.status(500).json({ error: "Insert failed" });
  }
});


// 获取最近24小时历史数据接口
app.get('/health/history', async (req, res) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 小时前
  try {
    const history = await Health.find({ timestamp: { $gte: oneDayAgo } }).sort({ timestamp: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history data' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`✅ Express server running on http://localhost:${port}`);
});
