// Route สำหรับหน้า Dashboard UI
const express = require('express');
const path = require('path');
const router = express.Router();
const index = require('../controllers/index');
const dashboardController = require('../controllers/dashboardController');
const employeeController = require('../controllers/employeeController');
const manageAccountController = require('../controllers/manageAccountController');
const assignWorkController = require('../controllers/assignWorkController');
const profileController = require('../controllers/profileController');
const { requireLogin } = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/bookingController');
const salaryController = require('../controllers/salaryController');
const { isNotCustomer } = require('../middlewares/authMiddleware');

// Route สำหรับหน้า Dashboard
router.get('/',isNotCustomer,requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/dashboard.html'));
});

// Route สำหรับหน้า Employee List (หน้าเว็บ)
router.get('/employeeList',isNotCustomer,requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/employeeList.html'));
});

router.get('/manageAccount',isNotCustomer, requireLogin , (req, res) => {
    res.sendFile(path.join(__dirname, '../view/manageAccount.html'));
});
router.get('/assignwork',isNotCustomer, requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/assignwork.html'));
});
router.get('/booking',isNotCustomer, requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/bookingBackend.html'));
});
router.get('/salary',isNotCustomer, requireLogin ,(req, res) => {
    res.sendFile(path.join(__dirname, '../view/salary.html'));
});


// API สำหรับดึงข้อมูล 
router.get('/data', dashboardController.getDashboardData);
router.get('/employees', dashboardController.getEmployeeList);
router.get('/employees/paginated', employeeController.getEmployeesPaginated);
router.get('/employees/data', manageAccountController .getEmployees);
router.get('/assign-work', dashboardController.getAssignWork);
router.get('/profile', profileController.getUserProfile);
router.get('/bookings', bookingController.getAllBookings);
router.get('/salary/search', salaryController.searchEmployee);
router.get('/assignWork/all', assignWorkController.getAllAssignments);
router.get('/bookings/search', bookingController.searchBookings);


//API สำหรับส่งข้อมูล
router.post('/employees/add', manageAccountController.addEmployee);
router.post('/salary/update', salaryController.updateEmployeeDetails);
router.post('/assignWork/save', assignWorkController.saveAssignment);
router.post('/logout', index.logoutUser);
router.post("/update-profile", profileController.updateUserProfile);


router.put('/assignWork/:id', assignWorkController.updateAssignment);
router.put('/bookings/status', bookingController.updateBookingStatus);

router.delete('/employees/delete', manageAccountController.deleteEmployee);
router.delete('/assignWork/:id', assignWorkController.deleteAssignment);
router.delete('/bookings/:BookingID', bookingController.deleteBooking);



module.exports = router;

