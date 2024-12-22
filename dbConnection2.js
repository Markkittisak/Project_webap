const mysql = require('mysql2/promise');

// สร้างการเชื่อมต่อฐานข้อมูล
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project',
    port: 2000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = pool;
