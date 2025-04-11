const users = {
    admin: 'adminpass',
    staff: 'staffpass',
    guest: 'guestpass'
};

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        localStorage.setItem('loggedInUser', username);
        logUserActivity(username);
        if (username === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'graph.html';
        }
    } else {
        document.getElementById('message').innerText = 'Invalid username or password';
    }
});

function logUserActivity(username) {
    const log = JSON.parse(localStorage.getItem('userLog')) || [];
    log.push({ username, timestamp: new Date().toISOString() });
    localStorage.setItem('userLog', JSON.stringify(log));
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Display user log on the admin page
if (document.getElementById('userLog')) {
    const log = JSON.parse(localStorage.getItem('userLog')) || [];
    document.getElementById('userLog').textContent = log.map(entry => `${entry.timestamp}: ${entry.username}`).join('\n');
}

// Graph page functionality
if (document.getElementById('temperatureChart')) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const temperatureData = generateTemperatureData();
    
    // Create an array to hold the colors for each data point
    const colors = temperatureData.map(data => {
        if (data.temperature > 30) {
            return 'rgba(255, 0, 0, 0.5)'; // Red for high temperature
        } else if (data.temperature < 15) {
            return 'rgba(0, 255, 0, 0.5)'; // Green for low temperature
        } else {
            return 'rgba(255, 255, 0, 0.5)'; // Yellow for normal temperature
        }
    });

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: temperatureData.map(data => data.time),
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatureData.map(data => data.temperature),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                backgroundColor: colors // Assign the colors array to the dataset
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}

// Function to generate mock temperature data
function generateTemperatureData() {
    const data = [];
    const currentTime = new Date();
    for (let i = 0; i < 10; i++) {
        const time = new Date(currentTime.getTime() - (i * 60000)); // 1 minute intervals
        const temperature = Math.floor(Math.random() * 40); // Random temperature between 0 and 40
        data.push({ time: time.toLocaleTimeString(), temperature });
    }
    return data.reverse(); // Reverse to show the latest data on the right
}