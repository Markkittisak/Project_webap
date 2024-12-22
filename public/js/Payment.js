// JavaScript for Payment Page

// Confirm Button Click Event
document.querySelector('.confirm-button').addEventListener('click', function () {
    // Validate that required checkboxes are checked
    const acceptPolicy = document.getElementById('accept-policy');
    if (!acceptPolicy.checked) {
        alert('You must acknowledge and accept the Cancellation and Privacy Policy to proceed.');
        return;
    }

    // Get values from form fields
    const firstName = document.querySelector('input[name="first-name"]').value;
    const lastName = document.querySelector('input[name="last-name"]').value;
    const email = document.querySelector('input[name="email"]').value;

    // Validate form fields
    if (!firstName || !lastName || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    // Confirm the reservation
    alert('Reservation confirmed! Thank you for booking with us.');
});

// Toggle Payment Methods
const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
paymentMethods.forEach(method => {
    method.addEventListener('change', function () {
        console.log(`Payment method selected: ${this.value}`);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.edit-booking').addEventListener('click', function () {
        const editBookingPageUrl = './#'; // หากไฟล์อยู่ในโฟลเดอร์เดียวกัน
        window.location.href = editBookingPageUrl;
    });
});

 
// Dynamically Update Room Info
function updateRoomInfo(roomType, roomRate, price) {
    document.querySelector('.room-type').textContent = roomType;
    document.querySelector('.room-rate').textContent = roomRate;
    document.querySelector('.total-price').textContent = `THB ${price}`;
}

// Example: Update room information dynamically
updateRoomInfo('Deluxe Queen Bed', 'Special Rate', '2,500.00');
