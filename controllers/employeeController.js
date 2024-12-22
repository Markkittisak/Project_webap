const db = require('../dbConnection');

exports.getEmployeesPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        const searchCondition = search
            ? `WHERE name LIKE ?`
            : ``;

        const query = `
            SELECT name, email, phone, department, role
            FROM employees_table
            ${searchCondition}
            LIMIT ? OFFSET ?;
        `;
        const [employees] = await db.promise().query(query, search ? [`%${search}%`, limit, offset] : [limit, offset]);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM employees_table
            ${searchCondition};
        `;
        const [countResult] = await db.promise().query(countQuery, search ? [`%${search}%`] : []);
        const total = countResult[0].total;

        res.json({
            employees,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};
