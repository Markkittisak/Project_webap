const db = require('../dbConnection');

// ดึงข้อมูลการจองทั้งหมด
exports.getAllBookings = (req, res) => {
    const query = `
        SELECT 
            b.BookingID, 
            b.RoomID, 
            b.Date_Check_in, 
            b.Date_Check_Out, 
            b.Requirement,
            CONCAT(a.name, ' ', a.lastname) AS CustomerFullName, 
            a.email AS CustomerEmail,
            r.RoomNumber, 
            r.RoomType, 
            r.BedSize, 
            r.Price, 
            r.CleanStatus,
            r.Image AS RoomImage,
            b.Current_stats
        FROM 
            booking b
        JOIN 
            account_customer a ON b.Customer_ID = a.Customer_id
        JOIN 
            rooms r ON b.RoomID = r.RoomNumber
        LIMIT 100;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            res.status(500).json({ error: 'Failed to retrieve bookings' });
        } else {
            res.json(results); 
        }
    });
};



exports.searchBookings = (req, res) => {
    const { search } = req.query; // รับคำค้นหาจาก query string

    // สร้างคำสั่ง SQL โดยรองรับการค้นหาชื่อหรือ Booking Number
    const query = `
    SELECT 
        b.BookingID, 
        b.RoomID, 
        b.Date_Check_in, 
        b.Date_Check_Out, 
        b.Requirement,
        CONCAT(a.name, ' ', a.lastname) AS CustomerFullName, 
        a.email AS CustomerEmail,
        r.RoomNumber, 
        r.RoomType, 
        r.BedSize, 
        r.Price, 
        r.CleanStatus,
        r.Image AS RoomImage
    FROM 
        booking b
    JOIN 
        account_customer a ON b.Customer_ID = a.Customer_id
    JOIN 
        rooms r ON b.RoomID = r.RoomNumber
    WHERE 
        b.BookingID LIKE ? OR CONCAT(a.name, ' ', a.lastname) LIKE ?
    LIMIT 100;
`;


    const searchParam = `%${search}%`;

    db.query(query, [searchParam, searchParam], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to search bookings' });
        } else {
            res.json(results);
        }
    });
};


exports.updateBookingStatus = (req, res) => {
    const { BookingID, status } = req.body;

    if (!BookingID || !status) {
        return res.status(400).json({ error: 'BookingID and status are required' });
    }

    const query = `UPDATE booking SET Current_stats = ? WHERE BookingID = ?`;

    db.query(query, [status, BookingID], (err, result) => {
        if (err) {
            console.error('Error updating booking status:', err);
            res.status(500).json({ error: 'Failed to update booking status' });
        } else {
            res.json({ message: 'Booking status updated successfully' });
        }
    });
};

exports.deleteBooking = (req, res) => {
    const { BookingID } = req.params;

    const query = `DELETE FROM booking WHERE BookingID = ?`;

    db.query(query, [BookingID], (err, result) => {
        if (err) {
            console.error('Error deleting booking:', err);
            res.status(500).json({ error: 'Failed to delete booking' });
        } else {
            res.json({ message: 'Booking deleted successfully' });
        }
    });
};