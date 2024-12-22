const express = require('express');
const path = require('path');
const router = express.Router();
const { requireLogin } = require('../middlewares/authMiddleware');

router.get('/', requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/employeedashboard/booking.html'));
});



module.exports = router;