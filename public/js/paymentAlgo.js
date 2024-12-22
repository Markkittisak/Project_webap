document.addEventListener('DOMContentLoaded', () => {
    // ดึงค่าจาก URL Query Parameters
    const params = new URLSearchParams(window.location.search);
    const roomType = params.get('room_type');
    const bedSize = params.get('bed_size');
    const price = params.get('price');
    const imagePath = params.get('image');

    // แสดงข้อมูลที่ได้จาก URL บนหน้า Payment
    document.querySelector('#room-type').innerText = `Room Type: ${roomType}`;
    document.querySelector('#bed-size').innerText = `Bed Size: ${bedSize}`;
    document.querySelector('#price').innerText = `Price: ${price} THB`;
    document.querySelector('#room-image').src = imagePath;

    // Fetch ข้อมูลโปรไฟล์
    fetch('/dashboard/profile')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="full-name"]').value = data.name;
            document.querySelector('input[name="email"]').value = data.email;
            document.querySelector('input[name="phone"]').value = data.phone;
        })
        .catch(error => console.error('Error fetching profile:', error));
});

document.querySelector('.confirm-button').addEventListener('click', () => {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;

    if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
    }

    const paymentData = {
        roomType: document.querySelector('#room-type').innerText.split(': ')[1],
        bedSize: document.querySelector('#bed-size').innerText.split(': ')[1],
        price: document.querySelector('#price').innerText.split(': ')[1].replace(' THB', ''),
        fullName: document.querySelector('input[name="full-name"]').value,
        email: document.querySelector('input[name="email"]').value,
        phone: document.querySelector('input[name="phone"]').value,
        paymentMethod: paymentMethod,
        paymentTime: new Date().toISOString()
    };

    fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Payment Successful!');
        console.log(data);
    })
    .catch(error => console.error('Error processing payment:', error));
});
