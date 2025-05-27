const express = require('express');
const login = require('./routes/login');
const postsRoutes = require('./routes/posts');
const path = require('path');
const pool = require("./routes/db");
const authenticateToken = require('./routes/authenticateToken');
const checkAdmin = require('./routes/checkAdmin');

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api', postsRoutes);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.get('/admin/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/verify-token', authenticateToken, checkAdmin, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});


login(app);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://57.128.212.224:${PORT}`);
});