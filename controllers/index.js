const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const db = require('../dbConnection');
const profileController = require('../controllers/profileController');


exports.registerUser = async (req, res) => {
    const {email, password, confirmPassword, phone, name, lastname } = req.body;
    const TypeofAccount = "Customer";
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        await User.createCustomer({email, password, phone, name, lastname , TypeofAccount});
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query to check Customer table
        const customerQuery = 'SELECT * FROM account_customer WHERE email = ?';
        const [customers] = await db.promise().query(customerQuery, [email]);

        // If the user exists in the Customer table
        if (customers.length > 0) {
            const customer = customers[0];
            const isPasswordValid = await bcrypt.compare(password, customer.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            req.session.user = {
                email: customer.email,
                typeOfAccount: 'Customer',
                name: `${customer.name} ${customer.lastname}`,
                phone: customer.phone,
            };
            return res.redirect('/');
        }

        // Query to check Staff table (ADD THIS)
        const staffQuery = 'SELECT * FROM employees_table WHERE email = ?';
        const [staffs] = await db.promise().query(staffQuery, [email]);

        // If the user exists in the Staff table
        if (staffs.length > 0) {
            const staff = staffs[0];
            const isPasswordValid = await bcrypt.compare(password, staff.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            req.session.user = {
                email: staff.email,
                typeOfAccount: 'Staff',
                name: staff.name,
                phone: staff.phone,
                role: staff.role,
                department: staff.department,
            };
            return res.redirect('/dashboard');
        }

        // If no user is found in both tables
        return res.status(401).json({ error: 'Invalid email or password.' });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ error: 'An error occurred during login.' });
    }
};



exports.requestResetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        const token = await User.generateResetToken(email);
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
        console.log('Password reset link:', resetLink);
        
        res.send('Password reset link has been generated. Check the terminal.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating reset link.');
    }
};



exports.resetPassword = async (req, res) => {
    const token = req.body.token || req.query.token;
    const newPassword = req.body.newPassword;

    console.log('Received token:', token);

    try {
        const user = await User.findByResetToken(token);
        if (!user) {
            return res.status(400).send('Invalid or expired token.'); 
        }

        console.log('User found for token:', user);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE Account_customer SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?';

        db.query(sql, [hashedPassword, user.id], (err) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).send('Error resetting password.'); 
            } else {
                return res.send('Password has been reset successfully.'); 
            }
        });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).send('Error resetting password.');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out.');
        } else {
            res.redirect('/login');
        }
    });
};

