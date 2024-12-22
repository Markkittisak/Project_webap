const { Op } = require('sequelize');
const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');

const checkRoomAvailability = async (req, res) => {
    const { checkin, checkout } = req.query;

    try {
        // ค้นหา RoomID ที่ถูกจอง
        const bookedRooms = await Booking.findAll({
            where: {
                [Op.or]: [
                    { Date_Check_in: { [Op.between]: [checkin, checkout] } },
                    { Date_Check_Out: { [Op.between]: [checkin, checkout] } }
                ]
            },
            attributes: ['RoomID']
        });

        const bookedRoomIDs = bookedRooms.map(room => room.RoomID);

        // ค้นหาห้องที่ยังว่างและดึงข้อมูลรูปมาด้วย
        const availableRooms = await Room.findAll({
            where: {
                RoomID: { [Op.notIn]: bookedRoomIDs }
            },
            attributes: ['RoomType', 'BedSize', 'Price', 'Image'] // ดึงฟิลด์ Image มาด้วย
        });

        res.json({ success: true, rooms: availableRooms });
    } catch (error) {
        console.error("Error fetching room availability:", error);
        res.status(500).json({ success: false, message: "Error fetching room availability" });
    }
};

module.exports = { checkRoomAvailability };
