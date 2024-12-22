const db = require('../dbConnection'); // เชื่อมต่อฐานข้อมูลที่คุณสร้างไว้
const moment = require('moment');

// ฟังก์ชันสำหรับบันทึกการจ่ายเงิน
const processPayment = (req, res) => {
    const { roomType, bedSize, price, fullName, email, phone, paymentMethod } = req.body;
    const paymentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // SQL Query สำหรับ Insert ข้อมูล
    const query = `
        INSERT INTO payments (room_type, bed_size, price, full_name, email, phone, payment_method, payment_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // ทำการ Insert ข้อมูล
    db.query(query, [roomType, bedSize, price, fullName, email, phone, paymentMethod, paymentTime], (err, result) => {
        if (err) {
            console.error('Error inserting payment data:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to process payment.',
            });
        }

        res.json({
            success: true,
            message: 'Payment recorded successfully.',
            data: {
                id: result.insertId,
                roomType,
                bedSize,
                price,
                fullName,
                email,
                phone,
                paymentMethod,
                paymentTime,
            },
        });
    });
};

// ฟังก์ชันสำหรับดึงข้อมูลโปรไฟล์
const getProfile = (req, res) => {
    // ข้อมูลโปรไฟล์จากฐานข้อมูล (สมมติว่าคุณมีผู้ใช้ที่ Login แล้ว)
    const userId = 1; // สมมติค่า User ID เป็น 1

    db.query('SELECT name, email, phone FROM account_customer WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch profile data.',
            });
        }

        if (result.length > 0) {
            res.json(result[0]); // ส่งข้อมูลโปรไฟล์กลับไป
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
    });
};

module.exports = { processPayment, getProfile };
