const express = require('express');
const path = require('path'); // Import path module
const router = express.Router();
const controllers = require('../controllers/index');
const { requireLogin } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');
const { checkRoomAvailability } = require('../controllers/roomController');
const { processPayment, getProfile } = require('../controllers/paymentController');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/homepage.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/signup.html')); 
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/login.html')); 
});

router.get('/request-reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/requestReset.html')); 
});

router.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/resetPassword.html')); 
});
router.get('/profileview', requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/profileview.html')); 
});

router.get('/roomselection',requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../view/roomrate.html'));
});
router.get('/payment',requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../view/payment.html'));
});


// POST routes
router.post('/signup', controllers.registerUser);
router.post('/login', controllers.loginUser);
router.post('/request-reset-password', controllers.requestResetPassword);
router.post('/reset-password', controllers.resetPassword);
router.post('/api/payment', processPayment);

router.get('/profileview', requireLogin, profileController.getUserProfile);
router.get('/check-availability', checkRoomAvailability);
router.get('/profile', getProfile);







module.exports = router;
