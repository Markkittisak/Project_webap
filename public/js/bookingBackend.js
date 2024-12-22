document.addEventListener('DOMContentLoaded', () => {
    const popupForm = document.querySelector('.popup-form');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const closePopup = document.querySelector('#close-popup');

    // ปุ่มสำหรับอัปเดตสถานะและลบการจอง
    const btnSubmit = document.querySelector('.btn-submit');
    const btnCheckin = document.querySelector('.btn-checkin-status');
    const btnCheckout = document.querySelector('.btn-checkout');
    const btnClean = document.querySelector('.btn-checkin');
    const btnDelete = document.querySelector('.btn-cancel');

    // ฟังก์ชันแสดงรายละเอียดการจองใน Popup
    const showBookingDetails = (booking) => {
        document.getElementById('popup-booking-no').value = booking.BookingID;
        document.getElementById('popup-name').value = booking.CustomerFullName;
        document.getElementById('popup-email').value = booking.CustomerEmail;
        document.getElementById('popup-room-number').value = booking.RoomNumber;
        document.getElementById('popup-room-type').value = booking.RoomType;
        document.getElementById('popup-price').value = booking.Price;
        document.getElementById('popup-bed-type').value = booking.BedSize;
        document.getElementById('popup-dates').value = `${booking.Date_Check_in} - ${booking.Date_Check_Out}`;
        document.getElementById('popup-requirement').value = booking.Requirement;
        document.getElementById('popup-clean-status').value = booking.Current_stats || 'N/A';

        // เก็บค่า BookingID ไว้ที่ Popup สำหรับการอัปเดต
        popupForm.dataset.bookingId = booking.BookingID;

        popupForm.classList.remove('hidden');
    };

    // ฟังก์ชันอัปเดตสถานะการจอง
    const updateBookingStatus = async (status) => {
        const BookingID = popupForm.dataset.bookingId;

        try {
            const response = await fetch('/dashboard/bookings/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ BookingID, status }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            alert(`Status updated to ${status}`);
            popupForm.classList.add('hidden');
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    // ฟังก์ชันลบการจอง
    const deleteBooking = async () => {
        const BookingID = popupForm.dataset.bookingId;

        try {
            const response = await fetch(`/dashboard/bookings/${BookingID}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete booking');
            alert('Booking deleted successfully');
            popupForm.classList.add('hidden');
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    // Event Listeners สำหรับปุ่มต่าง ๆ ใน Popup
    btnSubmit.addEventListener('click', () => updateBookingStatus('Completed'));
    btnCheckin.addEventListener('click', () => updateBookingStatus('Check-in'));
    btnCheckout.addEventListener('click', () => updateBookingStatus('Check-out'));
    btnClean.addEventListener('click', () => updateBookingStatus('Clean before done'));
    btnDelete.addEventListener('click', deleteBooking);

    closePopup?.addEventListener('click', () => popupForm.classList.add('hidden'));

    // ฟังก์ชันดึงข้อมูลจองจาก Backend
    const fetchBookings = async (query = '') => {
        try {
            const url = query ? `/dashboard/bookings/search?search=${query}` : `/dashboard/bookings`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const bookings = await response.json();
            renderBookings(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    // ฟังก์ชันแสดงรายการจอง
    const renderBookings = (bookings) => {
        const bookingList = document.getElementById('booking-list');
        bookingList.innerHTML = '';

        bookings.forEach((booking) => {
            const card = document.createElement('div');
            card.classList.add('booking-card');
            card.innerHTML = `
                <img src="/img/${booking.RoomImage || 'default.png'}" alt="Room Image" class="room-img">
                <p>Booking no. ${booking.BookingID}</p>
                <p>By: ${booking.CustomerFullName}</p>
                <p>Status: ${booking.Current_stats || 'N/A'}</p>
                <button class="view-btn">View</button>
            `;
            bookingList.appendChild(card);

            card.querySelector('.view-btn').addEventListener('click', () => {
                showBookingDetails(booking);
            });
        });
    };

    // ค้นหาการจอง
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchBookings(query);
    });

    // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
    fetchBookings();
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