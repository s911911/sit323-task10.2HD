const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const serviceAccount = require('./firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://human-detection-a3e60.firebaseio.com"
});

const db = admin.database();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health/latest', async (req, res) => {
  try {
    const snapshot = await db.ref('health/latest').once('value');
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send('Error retrieving health data');
  }
});

app.listen(port, () => {
  console.log(`✅ Express server running on http://localhost:${port}`);
});
