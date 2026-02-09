

async function deleteUser(userId, userName) {

    if (!confirm(`Are you sure you want to delete ${userName}?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        // Send DELETE request to server
        const response = await fetch(`/admin/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        // Handle response
        if (data.success) {
            alert('✅ ' + data.message);
            window.location.reload();
        } else {
            alert('❌ Error: ' + data.message);
        }
    } catch (error) {
        alert('❌ Error deleting user: ' + error.message);
    }
}
