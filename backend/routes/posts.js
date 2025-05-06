const express = require("express");
const multer = require("multer");
const pool = require("./db");
const authenticateToken = require("./authenticateToken");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/posts", authenticateToken, upload.single("image"), async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  const imageUrl = req.file ? req.file.filename : null;

  try {
    const [result] = await pool.query(
      "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
      [userId, content, imageUrl]
    );
    res.status(201).json({ message: "Post created successfully", postId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/posts", async (req, res) => {
    try {
      const [posts] = await pool.query(
        "SELECT posts.id, posts.content, posts.image_url, posts.date, users.name AS username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.date DESC"
      );
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;