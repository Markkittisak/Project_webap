
async function fetchAvailableRooms() {
    const urlParams = new URLSearchParams(window.location.search);
    const checkin = urlParams.get("checkin");
    const checkout = urlParams.get("checkout");

    if (!checkin || !checkout) {
        document.querySelector('.room-container').innerHTML = "<p>Please select valid dates.</p>";
        return;
    }

    try {
        const response = await fetch(`/check-availability?checkin=${checkin}&checkout=${checkout}`);
        const data = await response.json();

        if (data.success && data.rooms.length > 0) {
            document.querySelector('.room-container').innerHTML = data.rooms.map(room => `
                <div class="room-card">
                    <img src="/img/${room.Image}" alt="${room.RoomType}" class="room-image" style="width: 100%; height: auto;">
                    <div class="room-details">
                      <h3 class="h">${room.RoomType} - ${room.BedSize}</h3>
                      <p class="coin">Price: ${room.Price} THB</p>
                      <button  onclick="redirectToPayment('${room.RoomType}', '${room.BedSize}',${room.Price} , '/img/${room.Image}',)" class="btn-booking">Book Now</button>
                    </div>
                </div>
                    
            `).join('');
        } else {
            document.querySelector('.room-container').innerHTML = "<p>No rooms available for the selected dates.</p>";
        }
        
    } catch (error) {
        console.error("Error fetching room data:", error);
        document.querySelector('.room-container').innerHTML = "<p>Failed to fetch room data. Please try again later.</p>";
    }
}

fetchAvailableRooms();

function redirectToPayment(roomType, bedSize, price, imagePath) {
    const url = `/payment?room_type=${encodeURIComponent(roomType)}&bed_size=${encodeURIComponent(bedSize)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(imagePath)}`;
    window.location.href = url; // เปลี่ยนหน้าไปยัง URL ใหม่
}
