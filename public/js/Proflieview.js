document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
    };

    try {
        const response = await fetch("/dashboard/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Profile updated successfully!");
            window.location.reload();
        } else {
            const message = await response.text();
            alert(`Error: ${message}`);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
    }
});
