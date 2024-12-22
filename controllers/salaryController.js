const db = require("../dbConnection2");

// Search employee by ID or name
exports.searchEmployee = async (req, res) => {
    const query = req.query.query;

    try {
        // Query ค้นหาข้อมูล Employee จาก employees_table
        const [employees] = await db.query(
            'SELECT * FROM employees_table WHERE Employee_id = ? OR name LIKE ?',
            [query, `%${query}%`]
        );

        if (employees.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = employees[0]; // ดึงข้อมูล Employee ตัวแรก
        console.log('Employee ID:', employee.employee_id); // Log ดูค่า employee_id

        // Query ดึงข้อมูล Salary จาก salary_details
        const [salary] = await db.query(
            'SELECT * FROM salary_details WHERE employee_id = ?',
            [employee.employee_id]
        );

        console.log('Salary Data:', salary); // Log ดูข้อมูล salary

        // Query ดึงข้อมูล Payment จาก payment_information
        const [payment] = await db.query(
            'SELECT * FROM payment_information WHERE employee_id = ?',
            [employee.employee_id]
        );

        console.log('Payment Data:', payment); // Log ดูข้อมูล payment

        // ส่ง Response กลับไปที่ Frontend
        res.json({
            employee,
            salary: salary.length > 0 ? salary[0] : null,
            payment: payment.length > 0 ? payment[0] : null
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Update employee data
exports.updateEmployeeDetails = async (req, res) => {
    const { baseSalary, bonuses, deductions, lastPaymentDate } = req.body;

    try {
        await db.query(
            `UPDATE salary_details SET base_salary = ?, bonuses = ?, deductions = ? WHERE employee_id = ?`,
            [baseSalary, bonuses, deductions, req.body.employeeId]
        );

        await db.query(
            `UPDATE payment_information SET last_payment_date = ? WHERE employee_id = ?`,
            [lastPaymentDate, req.body.employeeId]
        );

        res.json({ message: "Employee details updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update details" });
    }
};
