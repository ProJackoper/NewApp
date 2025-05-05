const fs = require("fs");
const path = require("path");
const pool = require("./db.js");
const bcrypt = require("bcrypt");

function login(app) {
  const usersFilePath = path.join(__dirname, "../users.json");
  /*
  ----------REGISTER----------
  */

  app.post('/register', async (req, res) => {
    const { username, password, secondPassword } = req.body;
  
    if (password !== secondPassword) {
      return res.status(400).json({ message: 'Passwords do not match!', password, secondPassword });
    }
  
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ message: 'User already exists!' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await pool.query('INSERT INTO users (name, password) VALUES (?, ?)', [username, hashedPassword]);
  
      res.status(200).json({ message: 'Registered successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  /*
  ----------LOGIN----------
  */

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [username]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = rows[0];
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
}

module.exports = login;
