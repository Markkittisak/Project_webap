const db = require('../dbConnection');
const bcrypt = require('bcrypt');

// Fetch all employees
exports.getEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const search = req.query.search || "";
        const limit = 15; // Limit for pagination
        const offset = (page - 1) * limit;

        let query = 'SELECT SQL_CALC_FOUND_ROWS name, email, phone FROM employees_table';
        const params = [];

        if (search) {
            query += ' WHERE name LIKE ?';
            params.push(`%${search}%`);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [accounts] = await db.promise().query(query, params);
        const [[{ total }]] = await db.promise().query('SELECT FOUND_ROWS() as total');

        res.json({ 
            accounts, 
            total, 
            totalPages: Math.ceil(total / limit), 
            currentPage: page 
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

// Add a new employee
exports.addEmployee = async (req, res) => {
    try {
        const { name, email, phone, department, role, password } = req.body;

        if (!name || !email || !phone || !department || !role || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO employees_table (name, email, phone, department, role, password)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await db.promise().query(query, [name, email, phone, department, role, hashedPassword]);
        res.json({ message: 'Employee added successfully' });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Failed to add employee' });
    }
};
// Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // คำสั่งลบข้อมูลพนักงาน
        const deleteQuery = 'DELETE FROM employees_table WHERE email = ?';
        await db.promise().query(deleteQuery, [email]);

        // คำสั่งรีเซ็ต Employee_id ให้เรียงใหม่
        const resetQuery = `
            SET @row_number = 0;
            UPDATE employees_table
            SET Employee_id = (@row_number := @row_number + 1)
            ORDER BY Employee_id;
            ALTER TABLE employees_table AUTO_INCREMENT = 1;
        `;

        // แยกและ execute คำสั่ง SQL หลายบรรทัด
        const queries = resetQuery.split(';').filter(query => query.trim());
        for (const query of queries) {
            await db.promise().query(query);
        }

        res.json({ message: 'Employee deleted and IDs reset successfully.' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee and reset IDs' });
    }
};

