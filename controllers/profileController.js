const db = require('../dbConnection');

exports.getUserProfile = (req, res) => {
    if (!req.session.user) {
        req.session.user = {
            typeOfAccount: 'Guest',
            name: 'Guest User',
            email: null,
            phone: null,
        };
    }

    const user = req.session.user;

    if (user.typeOfAccount === 'Customer') {
        return res.json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            typeOfAccount: user.typeOfAccount,
        });
    } else if (user.typeOfAccount === 'Staff') {
        return res.json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            typeOfAccount: user.typeOfAccount,
            role: user.role,
            department: user.department,
        });
    } else {
        return res.json({
            name: user.name,
            typeOfAccount: user.typeOfAccount,
        });
    }
};


exports.updateUserProfile = (req, res) => {
    const { name, email, phone } = req.body;

    if (!req.session.user || req.session.user.typeOfAccount !== 'Customer') {
        return res.status(403).send("Access Denied");
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const query = "UPDATE account_customer SET name = ?, email = ?, phone = ? WHERE Customer_id = ?";
    db.query(query, [name, email, phone, req.session.user.Customer_id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating profile");
        }
        // อัปเดตข้อมูลใน Session
        req.session.user.name = name;
        req.session.user.email = email;
        req.session.user.phone = phone;

        res.status(200).send("Profile updated successfully");
    });
};


