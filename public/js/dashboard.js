// ดึงข้อมูล Dashboard จาก API
async function fetchDashboardData() {
    try {
        const response = await fetch('/dashboard/data');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const data = await response.json();

        // Update the DOM with the fetched data
        document.getElementById('income').innerText = data.revenue.toLocaleString('en-US');
        document.getElementById('cost').innerText = data.cost.toLocaleString('en-US');
        document.getElementById('sales').innerText = data.sales.toLocaleString('en-US');
        document.getElementById('totalEmployees').innerText = data.total_employees;
        document.getElementById('bookingData').innerText = data.bookingData;

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}


// ดึงรายชื่อพนักงานจาก API
async function fetchEmployeeList() {
    try {
        const response = await fetch('/dashboard/employees');
        const employees = await response.json();

        const tableBody = document.querySelector('.employee-list tbody');
        tableBody.innerHTML = ''; // ล้างข้อมูลเดิม

        employees.forEach(employee => {
            const row = `
                <tr>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.department}</td>
                    <td>${employee.role}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching employee list:', error);
    }
}


async function fetchAssignWork() {
    try {
        const response = await fetch('/dashboard/assign-work'); // เรียก API `/dashboard/assign-work`
        const data = await response.json();

        const tableBody = document.querySelector('.assign-work tbody');
        tableBody.innerHTML = ''; // ล้างข้อมูลเก่า

        data.forEach(work => {
            const row = `
                <tr>
                    <td>${work.name}</td>
                    <td>${work.status}</td>
                    <td>${work.date}</td>
                    <td>${work.department}</td>
                </tr>
            `;
            tableBody.innerHTML += row; // เพิ่มข้อมูลในตาราง
        });
    } catch (error) {
        console.error('Error fetching assign work data:', error);
    }
}





// เรียกใช้งานเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
    fetchEmployeeList();
    fetchAssignWork();
});

document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profileIcon'); // ไอคอนโปรไฟล์
    const profilePopup = document.getElementById('profilePopup'); // กล่อง Popup
    const closePopup = document.getElementById('closePopup'); // ปุ่มปิด Popup
    const popupContent = profilePopup.querySelector('.popup-content'); // เนื้อหา Popup

    // ฟังก์ชันดึงข้อมูลโปรไฟล์จาก API
    const fetchProfileData = async () => {
        try {
            const response = await fetch('/dashboard/profile'); // เรียก API
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const profile = await response.json(); // แปลงข้อมูลเป็น JSON

            // อัปเดต HTML ภายใน Popup
            popupContent.innerHTML = `
                <span id="closePopup" class="close">&times;</span>
                <h2>User Profile</h2>
                <p><strong>Name:</strong> ${profile.name}</p>
                <p><strong>Email:</strong> ${profile.email}</p>
                <p><strong>Phone:</strong> ${profile.phone}</p>
                <button id="logoutButton">Logout</button>
            `;

            // Re-bind ปุ่มปิด Popup หลังอัปเดตเนื้อหา
            document.getElementById('closePopup').addEventListener('click', () => {
                profilePopup.style.display = 'none';
            });

            document.getElementById('logoutButton').addEventListener('click', async function() {
                try {
                    const response = await fetch('/dashboard/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
            
                    if (response.ok) {
                        // หาก logout สำเร็จ ให้เปลี่ยนเส้นทางไปที่หน้า login
                        window.location.href = '/login';
                    } else {
                        // หากมีข้อผิดพลาดในการ logout
                        const errorData = await response.json();
                        alert('Logout failed: ' + errorData.error);
                    }
                } catch (error) {
                    console.error('Error during logout:', error);
                    alert('An error occurred while logging out. Please try again.');
                }
            });
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
            popupContent.innerHTML = `
                <span id="closePopup" class="close">&times;</span>
                <h2>Error</h2>
                <p>Failed to load profile data. Please try again later.</p>
            `;
            document.getElementById('closePopup').addEventListener('click', () => {
                profilePopup.style.display = 'none';
            });
        }
    };

    // เปิด Popup และโหลดข้อมูล
    profileIcon.addEventListener('click', () => {
        profilePopup.style.display = 'flex';
        fetchProfileData(); // โหลดข้อมูลโปรไฟล์
    });

    // ปิด Popup
    closePopup.addEventListener('click', () => {
        profilePopup.style.display = 'none';
    });
});


