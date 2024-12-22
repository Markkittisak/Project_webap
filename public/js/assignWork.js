document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const saveButton = document.querySelector(".save");
    const submitButton = document.querySelector(".submit");
    const historyTableBody = document.querySelector("table tbody");
    
    // Fetch and display history on page load
    const fetchHistory = () => {
        fetch("/dashboard/assignWork/all")
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch assignments');
                return response.json();
            })
            .then(data => {
                console.log("Fetched history data:", data); // Debug log
                historyTableBody.innerHTML = ""; // Clear old rows
    
                if (data.length === 0) {
                    historyTableBody.innerHTML = "<tr><td colspan='4'>No data available</td></tr>";
                    return;
                }
    
                data.forEach(assignment => {
                    const row = `
                        <tr>
                            <td>${assignment.work_name || "N/A"}</td>
                            <td class="${assignment.status === 'Approved' ? 'approved' : ''}">${assignment.status || "Pending"}</td>
                            <td>${assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "N/A"}</td>
                            <td>${assignment.department || "N/A"}</td>
                        </tr>
                    `;
                    historyTableBody.insertAdjacentHTML("beforeend", row);
                });
            })
            .catch(error => {
                console.error("Error fetching history:", error);
            });
    };

    // Save assignment
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();
    
        const workName = document.getElementById("name").value;
        const department = document.getElementById("department").value;
        const workDetail = document.getElementById("details").value;
        const dueDate = document.getElementById("due-date").value;
    
        if (!workName || !department || !workDetail || !dueDate) {
            alert("All fields are required.");
            return;
        }
    
        const formData = new FormData();
        formData.append("work_name", document.getElementById("name").value);
        formData.append("department", document.getElementById("department").value);
        formData.append("work_detail", document.getElementById("details").value);
        formData.append("assign_date", new Date().toISOString());
        formData.append("due_date", document.getElementById("due-date").value);
        
        fetch("/dashboard/assignWork/save", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                fetchHistory();// Refresh history
                alert(data.message);
            
            })
            .catch(error => {
                console.error("Error saving assignment:", error);
                alert("Failed to save assignment.");
            });
    });
    
    // Fetch history when the page loads
    fetchHistory();
    
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



