const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = {};
User.createCustomer = async (userData) => {
    const {email, password, phone, name, lastname } = userData;
    const TypeofAccount = "Customer";
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO  account_customer (email, password, phone, name, lastname,TypeofAccount) VALUES (?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(sql, [email, hashedPassword, phone, name, lastname,TypeofAccount], (err, result) => {
                if (err) {
                    reject(err); 
                } else {
                    resolve(result);
                }
            });
        });
    } catch (err) {
        throw new Error('Error creating  Account_customer: ' + err.message);
    }
};
User.findByUsername = (email) => {
    const sql = 'SELECT * FROM  account_customer WHERE email = ?';
    return new Promise((resolve, reject) => {
        db.query(sql, [email], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
};

//Reset password//-------------------------------------------------------------------------//
User.generateResetToken = async (email) => {
    console.log(`Generating reset token for email: ${email}`);
    const token = crypto.randomBytes(32).toString('hex'); // สร้าง Token
    const expiry = new Date(Date.now() + 3600000); // Token มีอายุ 1 ชั่วโมง
    const sql = 'UPDATE Account_customer SET reset_token = ?, reset_token_expiry = ? WHERE email = ?';

    return new Promise((resolve, reject) => {
        db.query(sql, [token, expiry, email], (err, result) => {
            if (err) {
                console.error('Database error:', err); // แสดงข้อผิดพลาดในฐานข้อมูล
                reject(err);
            } else if (result.affectedRows === 0) {
                console.log('Email not found in database.');
                reject(new Error('Email not found in database')); // แจ้งว่าไม่มี Email ในฐานข้อมูล
            } else {
                console.log('Token generated and stored:', token);
                resolve(token); // คืนค่า Token
            }
        });
    });
};


User.findByResetToken = async (token) => {
    //console.log(`Searching for user with token: ${token}`);
    const sql = 'SELECT * FROM  Account_customer WHERE reset_token = ? AND reset_token_expiry > NOW()';
    console.log(`Searching for user with token: ${token}`);

    return new Promise((resolve, reject) => {
        db.query(sql, [token], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                reject(err);
            } else if (result.length === 0) {
                console.log('Token not found or expired.');
                resolve(null);
            } else {
                console.log('User found for token:', result[0]);
                resolve(result[0]);
            }
        });
    });
};




//-----------------------------------------------------------------------------------------//

module.exports = User;


