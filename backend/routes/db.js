const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../assets/.env') });

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }, (err) => {console.log(err)});
  
  module.exports = pool.promise();

/*
baza danych od postów:
-id
-user_id
-content
-image_url
-date


*/