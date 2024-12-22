async function fetchUserProfile() {
    try {
        const response = await fetch('/dashboard/profile');
        if (!response.ok) throw new Error('Failed to fetch profile data');

        const data = await response.json();

        document.getElementById('profile-name').innerText = data.name || 'Guest';
        document.getElementById('profile-email').innerText = data.email || 'N/A';
        document.getElementById('profile-phone').innerText = data.phone || 'N/A';
        document.getElementById('profile-type').innerText = data.typeOfAccount || 'Guest';

        if (data.typeOfAccount === 'Staff') {
            document.getElementById('staff-info').style.display = 'block';
            document.getElementById('profile-role').innerText = data.role || 'N/A';
            document.getElementById('profile-department').innerText = data.department || 'N/A';
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchUserProfile);
