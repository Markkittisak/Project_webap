let currentPage = 1;
const rowsPerPage = 10;

async function fetchEmployees(page = 1, search = '') {
    try {
        const response = await fetch(`/dashboard/employees/paginated?page=${page}&limit=${rowsPerPage}&search=${search}`);
        const data = await response.json();

        const tableBody = document.querySelector('.employee-list tbody');
        tableBody.innerHTML = '';

        data.employees.forEach(employee => {
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

        updatePagination(data.totalPages, data.currentPage, search);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

function updatePagination(totalPages, currentPage, search = '') {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-btn');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            fetchEmployees(i, search);
        });
        pagination.appendChild(button);
    }
}

// เพิ่มฟังก์ชันสำหรับค้นหา
document.getElementById('search-button').addEventListener('click', () => {
    const search = document.getElementById('search-input').value;
    fetchEmployees(1, search);
});

// ดึงข้อมูลเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', () => fetchEmployees(currentPage));

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
            `;

            // Re-bind ปุ่มปิด Popup หลังอัปเดตเนื้อหา
            document.getElementById('closePopup').addEventListener('click', () => {
                profilePopup.style.display = 'none';
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
        fetchProfileData(); 
    });

    // ปิด Popup
    closePopup.addEventListener('click', () => {
        profilePopup.style.display = 'none';
    });
});
