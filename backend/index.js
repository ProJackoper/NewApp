const express = require('express');
const login = require('./routes/login');

const app = express();

app.use(express.json());

login(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});