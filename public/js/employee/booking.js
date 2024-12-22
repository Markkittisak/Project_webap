document.addEventListener('DOMContentLoaded', () => {
    const bookingList = document.getElementById('booking-list');
    const popup = document.getElementById('detail-popup');
    const closePopup = document.getElementById('close-popup');

    // ดึงข้อมูล Booking
    fetch('/dashboard/bookings')
        .then((response) => response.json())
        .then((bookings) => {
            bookings.forEach((booking) => {
                const card = document.createElement('div');
                card.classList.add('booking-card');
                card.innerHTML = `
                    <h4>Room Image</h4>
                    <p>Booking no. ${booking.BookingID}</p>
                    <p>By: ${booking.CustomerFullName}</p>
                    <button class="view-btn" data-id="${booking.BookingID}">View</button>
                `;
                bookingList.appendChild(card);

                // Event Listener สำหรับปุ่ม View
                card.querySelector('.view-btn').addEventListener('click', () => {
                    document.getElementById('popup-booking-no').value = booking.BookingID;
                    document.getElementById('popup-name').value = booking.CustomerFullName;
                    document.getElementById('popup-email').value = booking.CustomerEmail;
                    document.getElementById('popup-room-number').value = booking.RoomNumber;
                    document.getElementById('popup-dates').value = `${booking.Date_Check_in} - ${booking.Date_Check_Out}`;
                    document.getElementById('popup-requirement').value = booking.Requirement;
                    document.getElementById('popup-bed-type').value = booking.BedSize; // ใหม่
                    document.getElementById('popup-room-type').value = booking.RoomType; // ใหม่
                    document.getElementById('popup-price').value = booking.Price; // ใหม่
                    document.getElementById('popup-clean-status').value = booking.CleanStatus; // ใหม่
                
                    popup.classList.remove('hidden');
                });
            });
        })
        .catch((error) => {
            console.error('Error fetching bookings:', error);
        });

    // ปิด Popup
    closePopup.addEventListener('click', () => {
        popup.classList.add('hidden');
    });
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
