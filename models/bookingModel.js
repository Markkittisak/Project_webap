const { Sequelize, DataTypes } = require('sequelize'); // นำเข้า Sequelize และ DataTypes
const sequelize = require('../database/connection');   // เชื่อมต่อกับ database

const Booking = sequelize.define('Booking', {  // ใช้ sequelize instance สร้าง model
    BookingID: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RoomID: {
        type: DataTypes.INTEGER
    },
    Date_Check_in: {
        type: DataTypes.DATE
    },
    Date_Check_Out: {
        type: DataTypes.DATE
    },
    Customer_ID: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'booking', // ชื่อ Table ใน Database
    timestamps: false     // ไม่ใช้ createdAt และ updatedAt
});

module.exports = Booking;
