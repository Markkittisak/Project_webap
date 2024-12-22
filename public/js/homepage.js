document.addEventListener("DOMContentLoaded", () => {
    // เรียกใช้งานปุ่มประเภทการเข้าพัก (Overnight Stays และ Day Use Stays)
    const stayTypeButtons = document.querySelectorAll(".stay-type");
    stayTypeButtons.forEach(button => {
        button.addEventListener("click", () => {
            stayTypeButtons.forEach(b => b.classList.remove("active"));  // ลบ class active จากทุกปุ่ม
            button.classList.add("active");  // เพิ่ม class active ให้ปุ่มที่คลิก
        });
    });

    // เรียกใช้งาน Popup แขก
    const guestSummary = document.getElementById("guest-summary");
    const guestPopup = document.getElementById("guest-popup");
    const doneButton = document.getElementById("guest-done");

    guestSummary.addEventListener("click", () => {
        guestPopup.classList.toggle("active");  // เปิด/ปิด guest-popup
    });

    doneButton.addEventListener("click", () => {
        guestPopup.classList.remove("active");  // ปิด guest-popup
    });

    // ฟังก์ชันอัปเดตสรุปเมื่อมีการปรับจำนวนแขก
    const roomCountElement = document.getElementById("room-count");
    const adultCountElement = document.getElementById("adult-count");
    const childCountElement = document.getElementById("child-count");
    const summaryText = document.getElementById("summary-text");

    function updateSummary() {
        const roomCount = parseInt(roomCountElement.textContent) || 0;
        const adultCount = parseInt(adultCountElement.textContent) || 0;
        const childCount = parseInt(childCountElement.textContent) || 0;

        const summary = `${adultCount} adult${adultCount !== 1 ? "s" : ""}, ${roomCount} room${roomCount !== 1 ? "s" : ""}${childCount > 0 ? `, ${childCount} child${childCount > 1 ? "ren" : ""}` : ""}`;
        summaryText.textContent = summary;  // อัปเดตข้อความสรุป
    }

    // ฟังก์ชันปรับจำนวนห้อง, ผู้ใหญ่, และเด็ก
    document.querySelectorAll(".guest-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const target = event.target.dataset.target;
            const countElement = document.getElementById(`${target}-count`);
            let count = parseInt(countElement.textContent) || 0;

            if (button.classList.contains("increase-btn")) {
                count++;  // เพิ่มค่า
            } else if (button.classList.contains("decrease-btn") && count > 0) {
                count--;  // ลดค่า
            }

            countElement.textContent = count;
            updateSummary();  // อัปเดตข้อความสรุปหลังปรับจำนวน
        });
    });

    $(document).ready(function () {
        // Datepicker สำหรับ Check-in
        $("#check-in").datepicker({
            dateFormat: "yy-mm-dd", // รูปแบบวันที่
            minDate: 0, // เลือกวันที่เริ่มต้นตั้งแต่วันนี้
            onSelect: function (selectedDate) {
                // กำหนดวันที่เริ่มต้นใน Check-out ให้มากกว่า Check-in
                $("#check-out").datepicker("option", "minDate", selectedDate);
            },
        });
    
        // Datepicker สำหรับ Check-out
        $("#check-out").datepicker({
            dateFormat: "yy-mm-dd",
            minDate: 0, // วันที่เริ่มต้น
            onSelect: function (selectedDate) {
                // กำหนดวันที่สิ้นสุดใน Check-in ให้ไม่เกิน Check-out
                $("#check-in").datepicker("option", "maxDate", selectedDate);
            },
        });
    });
    

    // ปิด Popup เมื่อคลิกที่นอก Popup
    document.addEventListener("click", (event) => {
        if (!guestPopup.contains(event.target) && !guestSummary.contains(event.target)) {
            guestPopup.classList.remove("active");
        }
    });

    const form = document.querySelector(".booking-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // ป้องกันการ submit ปกติ
    
        const formData = getFormData();
        const response = await fetch(`/api/rooms/available?checkin=${formData.checkIn}&checkout=${formData.checkOut}`);
        const data = await response.json();
    
        if (data.success) {
            console.log(data.rooms); // ห้องที่ว่างพร้อมประเภท
            localStorage.setItem('availableRooms', JSON.stringify(data.rooms));
            window.location.href = '/roomselection';
        } else {
            alert('Error fetching room availability');
        }
    });
    
});

function getFormData() {
    const checkInDate = document.getElementById("check-in").value;
    const checkOutDate = document.getElementById("check-out").value;
    const roomCount = parseInt(document.getElementById("room-count").textContent) || 0;
    const adultCount = parseInt(document.getElementById("adult-count").textContent) || 0;
    const childCount = parseInt(document.getElementById("child-count").textContent) || 0;

    return {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        rooms: roomCount,
        adults: adultCount,
        children: childCount,
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    const loginButton = document.getElementById("login-button"); // ปุ่มเข้าสู่ระบบ
    const signupButton = document.getElementById("signup-button"); // ปุ่มสมัครสมาชิก
    const profileEndpoint = "/dashboard/profile"; // เส้นทางเรียกข้อมูลโปรไฟล์

    try {
        // เรียก API ตรวจสอบข้อมูลโปรไฟล์
        const response = await fetch(profileEndpoint);
        const userData = await response.json();

        // ถ้าผู้ใช้ล็อกอิน (typeOfAccount ไม่ใช่ Guest) ให้ซ่อนปุ่มล็อกอินและปุ่มสมัครสมาชิก
        if (userData.typeOfAccount && userData.typeOfAccount !== "Guest") {
            if (loginButton) loginButton.style.display = "none";
            if (signupButton) signupButton.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const logoutButton = document.getElementById("logout-button");

    try {
        // เรียก API /dashboard/profile เพื่อดึงข้อมูลผู้ใช้
        const response = await fetch("/dashboard/profile");
        const userData = await response.json();

        // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
        if (userData.typeOfAccount && userData.typeOfAccount.toLowerCase() === "customer") {
            // แสดงปุ่ม Logout
            logoutButton.style.display = "inline";
        }

        // ฟังก์ชัน Logout
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();

            // เรียก API สำหรับ Logout
            const logoutResponse = await fetch("/dashboard/logout", {
                method: "POST",
                credentials: "include", // ส่ง cookie ไปด้วย
            });

            if (logoutResponse.ok) {
                alert("You have been logged out.");
                window.location.href = "/"; // กลับไปหน้า Homepage
            } else {
                alert("Logout failed. Please try again.");
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
});
