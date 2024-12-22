let currentPage = 1;
let totalPages = 1;
let searchQuery = "";

async function fetchAccounts(page = 1, query = "") {
    try {
        const response = await fetch(`/dashboard/employees/data?page=${page}&search=${query}`);
        if (!response.ok) throw new Error('Failed to fetch employees data');

        const data = await response.json();
        const { accounts, total, totalPages: totalPg, currentPage: currPg } = data;

        // Update global variables
        currentPage = currPg;
        totalPages = totalPg;

        const tableBody = document.querySelector('.right-panel tbody');
        tableBody.innerHTML = '';

        accounts.forEach(account => {
            const row = `
                <tr>
                    <td>${account.name}</td>
                    <td>${account.email}</td>
                    <td>${account.phone}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
        document.getElementById('prev-btn').disabled = currentPage === 1;
        document.getElementById('next-btn').disabled = currentPage === totalPages;
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}




document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        fetchAccounts(currentPage - 1, searchQuery);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchAccounts(currentPage + 1, searchQuery);
    }
});

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    searchQuery = query;
    fetchAccounts(1, query); // Reset to page 1 when searching
});


async function deleteEmployee(email) {
    const confirmation = prompt("Type 'I confirm to delete this account' to proceed:");
    if (confirmation !== 'I confirm to delete this account') {
        alert('Confirmation text does not match.');
        return;
    }

    try {
        const response = await fetch('/dashboard/employees/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete employee');
        }

        alert('Employee deleted successfully');
        fetchAccounts(); // อัปเดตข้อมูลในตาราง
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert(error.message);
    }
}

document.getElementById('add-account-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const department = document.getElementById('department').value;
    const role = document.getElementById('Role').value; 
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/dashboard/employees/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, department, role, password }), 
        });

        if (!response.ok) throw new Error('Failed to add employee');

        alert('Employee added successfully');
        fetchAccounts(); 
    } catch (error) {
        console.error('Error adding employee:', error);
        alert('Failed to add employee');
    }
});


document.addEventListener('DOMContentLoaded', fetchAccounts);
document.addEventListener('DOMContentLoaded', () => fetchAccounts());

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
        fetchProfileData(); // โหลดข้อมูลโปรไฟล์
    });

    // ปิด Popup
    closePopup.addEventListener('click', () => {
        profilePopup.style.display = 'none';
    });
});
