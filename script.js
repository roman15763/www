document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const group = document.getElementById('group').value;
    const email = document.getElementById('email').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, group, email })
    });

    const user = await response.json();
    loadUserDashboard(user);
});

async function loadUserDashboard(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-group').textContent = user.group;
    document.getElementById('user-points').textContent = user.points;

    const usersResponse = await fetch('/users');
    const users = await usersResponse.json();
    const userRanking = document.getElementById('user-ranking');
    userRanking.innerHTML = '';

    users.forEach(u => {
        const row = `<tr><td>${u.name}</td><td>${u.group}</td><td>${u.points}</td></tr>`;
        userRanking.innerHTML += row;
    });

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('user-dashboard').style.display = 'block';
}

// Адмінська частина
document.getElementById('adminLoginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const adminName = document.getElementById('adminName').value;
    const adminPassword = document.getElementById('adminPassword').value;

    const response = await fetch('/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminName, adminPassword })
    });

    if (response.ok) {
        loadAdminDashboard();
    } else {
        alert('Invalid admin credentials');
    }
});

async function loadAdminDashboard() {
    const usersResponse = await fetch('/users');
    const users = await usersResponse.json();
    const userList = document.getElementById('admin-user-list');
    userList.innerHTML = '';

    users.forEach(u => {
        const row = `<tr>
                        <td>${u.name}</td>
                        <td>${u.group}</td>
                        <td>${u.points}</td>
                        <td>
                            <button onclick="updatePoints('${u._id}', 10)">Add 10 Points</button>
                            <button onclick="updatePoints('${u._id}', -10)">Remove 10 Points</button>
                        </td>
                    </tr>`;
        userList.innerHTML += row;
    });

    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
}

async function updatePoints(userId, points) {
    await fetch('/update-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points })
    });

    loadAdminDashboard();
}
