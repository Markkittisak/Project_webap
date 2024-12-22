const db = require('../dbConnection'); // การเชื่อมต่อฐานข้อมูล

// ฟังก์ชันดึงข้อมูลสำหรับหน้า Dashboard
exports.getDashboardData = async (req, res) => {
    try {
        // Queries for revenue, cost, sales, hotel balance, and employee count
        const [revenueData] = await db.promise().query('SELECT SUM(amount) AS revenue FROM revenue_table');
        const [costData] = await db.promise().query('SELECT SUM(cost) AS total_cost FROM cost_table');
        const [salesData] = await db.promise().query('SELECT SUM(sales) AS total_sales FROM sales_table');
        //const [hotelBalanceData] = await db.promise().query('SELECT hotel_balance FROM financial_summary ORDER BY updated_at DESC LIMIT 1');
        const [employeeCountData] = await db.promise().query('SELECT COUNT(*) AS total_employees FROM employees_table');
        const [bookingData] = await db.promise().query('SELECT COUNT(*) AS total_bookings FROM booking');
        res.json({
            revenue: revenueData[0].revenue || 0,
            cost: costData[0].total_cost || 0,
            sales: salesData[0].total_sales || 0,
            //hotel_balance: hotelBalanceData[0]?.hotel_balance || 0,
            total_employees: employeeCountData[0]?.total_employees || 0,
            bookingData: bookingData[0]?.total_bookings || 0
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};


// ดึงข้อมูลพนักงาน
exports.getEmployeeList = async (req, res) => {
    try {
        const employeeQuery = `SELECT name, email, phone, department, 
        role FROM employees_table
        ORDER BY name DESC
        LIMIT 5` 
        ;
        const [result] = await db.promise().query(employeeQuery);
        res.json(result);

    } catch (err) {
        console.error('Error fetching employee list:', err);
        res.status(500).json({ error: 'Failed to fetch employee list' });
    }
};


exports.getAssignWork = async (req, res) => {
    try {
        // Query ดึงข้อมูลเฉพาะฟิลด์ที่ต้องการ
        const query = `
            SELECT 
                work_name AS name, 
                status, 
                DATE_FORMAT(assign_Date, '%d %b %Y') AS date, 
                department 
            FROM assignments
            ORDER BY assign_Date DESC;
        `;

        // ใช้ db.promise().query เพื่อดึงข้อมูล
        const [result] = await db.promise().query(query);

        // ส่งข้อมูล JSON กลับไปยัง frontend
        res.status(200).json(result);
    } catch (error) {
        // จัดการ error
        console.error('Error fetching assign work data:', error);
        res.status(500).json({ error: 'Failed to fetch assign work data' });
    }
};