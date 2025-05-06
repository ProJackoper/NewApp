const express = require('express');
const login = require('./routes/login');
const postsRoutes = require('./routes/posts');

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api', postsRoutes);

login(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});