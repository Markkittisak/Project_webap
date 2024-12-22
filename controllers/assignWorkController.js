const db = require('../dbConnection');
const multer = require('multer');
const upload = multer();

// Get all assignments
exports.getAllAssignments = (req, res) => {
    const query = 'SELECT work_name, work_detail, assign_date, due_date, status, department FROM assignments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching assignments:', err);
            return res.status(500).json({ message: 'Failed to retrieve assignments' });
        }
        res.json(results); // Correctly send data as JSON
    });
};

// Save an assignment
exports.saveAssignment = [
    upload.none(), // Parse multipart/form-data
    (req, res) => {
        const { work_name, work_detail, department, assign_date, due_date } = req.body;

        console.log("Received data:", { work_name, work_detail, department, assign_date, due_date });

        if (!work_name || !work_detail || !department || !due_date) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const query = "INSERT INTO assignments (work_name, work_detail, department, assign_date, due_date, status) VALUES (?, ?, ?, ?, ?, 'Pending')";
        db.query(query, [work_name, work_detail, department, assign_date, due_date], (err, results) => {
            if (err) {
                console.error('Error saving assignment:', err);
                return res.status(500).json({ message: 'Failed to save assignment' });
            }
            res.json({ message: 'Assignment saved successfully', id: results.insertId });
        });
    }
];


// Delete an assignment
exports.deleteAssignment = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM assignments WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting assignment:', err);
            return res.status(500).json({ message: 'Failed to delete assignment' });
        }
        res.json({ message: 'Assignment deleted successfully' });
    });
};

// Optional: Update an assignment
exports.updateAssignment = (req, res) => {
    const { id } = req.params;
    const { work_name, work_detail, department, assign_date, due_date, status } = req.body;
    const query = `
        UPDATE assignments 
        SET work_name = ?, work_detail = ?, department = ?, assign_date = ?, due_date = ?, status = ?
        WHERE id = ?
    `;
    db.query(query, [work_name, work_detail, department, assign_date, due_date, status, id], (err, results) => {
        if (err) {
            console.error('Error updating assignment:', err);
            return res.status(500).json({ message: 'Failed to update assignment' });
        }
        res.json({ message: 'Assignment updated successfully' });
    });
};
