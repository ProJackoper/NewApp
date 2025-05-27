const express = require("express");
const multer = require("multer");
const pool = require("./db");
const authenticateToken = require("./authenticateToken");
const checkAdmin = require("./checkAdmin");

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

router.post(
  "/posts",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? req.file.filename : null;

    try {
      const [result] = await pool.query(
        "INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)",
        [userId, content, imageUrl, false]
      );
      res.status(201).json({
        message: "Post created successfully",
        postId: result.insertId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/posts", async (req, res) => {
  try {
    const [posts] = await pool.query(
      "SELECT posts.id, posts.content, posts.image_url, posts.date, users.name AS username, " +
        "(SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes_count " +
        "FROM posts JOIN users ON posts.user_id = users.id " +
        "WHERE posts.is_approved = TRUE " +
        "ORDER BY posts.date DESC"
    );
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/adminPosts", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const [posts] = await pool.query(
      "SELECT posts.id, posts.content, posts.image_url, posts.date, users.name AS username " +
        "FROM posts JOIN users ON posts.user_id = users.id " +
        "WHERE posts.is_approved = False " +
        "ORDER BY posts.date DESC"
    );
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/acceptPost/:id",
  authenticateToken,
  checkAdmin,
  async (req, res) => {
    const postId = req.params.id;

    try {
      await pool.query("UPDATE posts SET is_approved = TRUE WHERE id = ?", [
        postId,
      ]);
      res.status(200).json({ message: "Post accepted" });
    } catch (error) {
      console.error("Error accepting post:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/denyPost/:id",
  authenticateToken,
  checkAdmin,
  async (req, res) => {
    const postId = req.params.id;

    try {
      await pool.query("DELETE FROM posts WHERE id = ?", [postId]);
      res.status(200).json({ message: "Post denied and deleted" });
    } catch (error) {
      console.error("Error denying post:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/posts/:id/like", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    await pool.query(
      "INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)",
      [userId, postId]
    );
    res.status(200).json({ message: "Post liked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/posts/:id/like", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    await pool.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [
      userId,
      postId,
    ]);
    res.status(200).json({ message: "Like removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/posts/:id/likes/count", async (req, res) => {
  const postId = req.params.id;
  try {
    const [[{ count }]] = await pool.query(
      "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
      [postId]
    );
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/liked-posts", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [liked] = await pool.query(
      "SELECT post_id FROM likes WHERE user_id = ?",
      [userId]
    );
    res.status(200).json(liked.map((l) => l.post_id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
