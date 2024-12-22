document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/profile');
        if (!response.ok) throw new Error('Not logged in');

        const data = await response.json();

        // หากเป็น Guest ให้เปลี่ยนเส้นทางไปหน้า Login
        if (data.typeOfAccount === 'Guest') {
            alert('Please log in to access this page.');
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        window.location.href = '/login';
    }
});
