function searchEmployee() {
    const searchInput = document.getElementById('searchInput').value;

    fetch(`/dashboard/salary/search?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // ตรวจสอบ JSON ที่ส่งมา

            if (data.salary) {
                // Update Salary Details
                document.getElementById('baseSalary').value = data.salary.base_salary || 0;
                document.getElementById('bonuses').value = data.salary.bonuses || 0;
                document.getElementById('deductions').value = data.salary.deductions || 0;
                document.getElementById('totalCompensation').innerText = data.salary.total_compensation || 0;
            } else {
                alert('No salary data available for this employee.');
            }

            if (data.payment) {
                // Update Payment Information
                document.getElementById('lastPaymentDate').value = data.payment.last_payment_date || '';
                document.getElementById('nextPaymentDate').innerText = data.payment.next_payment_date || 'N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching salary data:', error);
            alert('Error fetching salary data');
        });
}


function displayEmployeeInfo(employee) {
    document.getElementById('employeeName').textContent = employee.name;
    document.getElementById('employeeID').textContent = employee.employee_id;
    document.getElementById('department').textContent = employee.department;
    document.getElementById('role').textContent = employee.role;
}

function displaySalaryDetails(salary) {
    document.getElementById('baseSalary').value = salary.base_salary;
    document.getElementById('bonuses').value = salary.bonuses;
    document.getElementById('deductions').value = salary.deductions;
    document.getElementById('totalCompensation').textContent =
        salary.base_salary + salary.bonuses - salary.deductions;
}

function displayPaymentInfo(payment) {
    document.getElementById('lastPaymentDate').value = payment.last_payment_date;
    document.getElementById('nextPaymentDate').textContent = payment.next_payment_date;
}

function updateEmployeeDetails() {
    const updatedData = {
        baseSalary: document.getElementById('baseSalary').value,
        bonuses: document.getElementById('bonuses').value,
        deductions: document.getElementById('deductions').value,
        lastPaymentDate: document.getElementById('lastPaymentDate').value,
    };

    fetch(`/dashboard/salary/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || "Update successful!");
            searchEmployee(); // Refresh data
        })
        .catch(error => console.error("Error updating data:", error));
}