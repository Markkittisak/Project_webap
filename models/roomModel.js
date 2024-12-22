const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Room = sequelize.define('Room', {
    RoomID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    RoomType: { type: DataTypes.STRING, allowNull: false },
    BedSize: { type: DataTypes.STRING, allowNull: false },
    Price: { type: DataTypes.INTEGER, allowNull: false },
    Image: { type: DataTypes.STRING, allowNull: true } // ฟิลด์สำหรับเก็บ URL รูปภาพ
}, {
    tableName: 'rooms',
    timestamps: false
});

module.exports = Room;
