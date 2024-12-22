const mysql = require('mysql2');

// สร้างการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',     // ค่าเริ่มต้นของ XAMPP
    user: 'root',          // ผู้ใช้ค่าเริ่มต้นของ MySQL
    password: '',          // ว่างเปล่า (ค่าเริ่มต้นใน XAMPP)
    database: 'Project',      // ชื่อฐานข้อมูล
    port: 2000,
});



db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database!');
    }
});


module.exports = db;
