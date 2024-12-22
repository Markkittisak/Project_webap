exports.requireLogin = (req, res, next) => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
    if (!req.session.user || req.session.user.typeOfAccount === 'Guest') {
        return res.redirect('/login'); // หากยังไม่ได้ล็อกอิน ให้เปลี่ยนไปที่หน้า Login
    }
    next(); // หากล็อกอินแล้ว ให้ดำเนินการต่อ
};

//const fetch = require("node-fetch");

exports.isNotCustomer = async (req, res, next) => {
    try {
        // เรียก API /dashboard/profile
        const response = await fetch("http://localhost:4000/dashboard/profile", {
            method: "GET",
            headers: {
                Cookie: req.headers.cookie, // ส่ง cookie เพื่อรักษา session
            },
        });

        // แปลง response เป็น JSON
        const userData = await response.json();

        // ตรวจสอบ TypeOfAccount
        if (userData.typeOfAccount && userData.typeOfAccount.toLowerCase() === "customer") {
            // ส่งกลับไปที่ Homepage พร้อมแสดง alert
            return res.send(`
                <script>
                    alert("Access Denied: Customers cannot access the dashboard.");
                    window.location.href = "/";
                </script>
            `);
        }

        next(); // ผ่านการตรวจสอบ ไปยัง endpoint ถัดไป
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).send(`
            <script>
                alert("Internal Server Error. Please try again later.");
                window.location.href = "/";
            </script>
        `);
    }
};
