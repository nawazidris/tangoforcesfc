let adminPlayers = [];
let adminMatches = [];

// Validation functions
const validatePlayerForm = () => {
    const name = document.getElementById('playerName').value.trim();
    const nickname = document.getElementById('playerNickname').value.trim();
    const position = document.getElementById('playerPosition').value;
    const number = parseInt(document.getElementById('playerNumber').value);
    const goals = parseInt(document.getElementById('playerGoals').value);
    const assists = parseInt(document.getElementById('playerAssists').value);

    if (name.length < 2) {
        alert('Player name must be at least 2 characters long');
        return false;
    }

    if (nickname.length < 1) {
        alert('Player nickname is required');
        return false;
    }

    if (!position) {
        alert('Please select a position');
        return false;
    }

    if (isNaN(number) || number < 1 || number > 99) {
        alert('Jersey number must be between 1 and 99');
        return false;
    }

    // Check for duplicate jersey numbers
    const existingPlayer = adminPlayers.find(p => p.number === number && p.id !== parseInt(document.getElementById('playerId').value || 0));
    if (existingPlayer) {
        alert(`Jersey number ${number} is already taken by ${existingPlayer.name}`);
        return false;
    }

    if (isNaN(goals) || goals < 0) {
        alert('Goals must be a non-negative number');
        return false;
    }

    if (isNaN(assists) || assists < 0) {
        alert('Assists must be a non-negative number');
        return false;
    }

    return true;
};

const validateMatchForm = () => {
    const homeTeam = document.getElementById('homeTeam').value.trim();
    const awayTeam = document.getElementById('awayTeam').value.trim();
    const date = document.getElementById('matchDate').value;
    const time = document.getElementById('matchTime').value;
    const venue = document.getElementById('matchVenue').value.trim();

    if (homeTeam.length < 2) {
        alert('Home team name must be at least 2 characters long');
        return false;
    }

    if (awayTeam.length < 2) {
        alert('Away team name must be at least 2 characters long');
        return false;
    }

    if (!date) {
        alert('Please select a match date');
        return false;
    }

    if (!time) {
        alert('Please select a match time');
        return false;
    }

    if (venue.length < 2) {
        alert('Venue must be at least 2 characters long');
        return false;
    }

    return true;
};

// Stats overview update function
const updateStatsOverview = () => {
    const totalPlayers = adminPlayers.length;
    const totalGoals = adminPlayers.reduce((sum, player) => sum + (player.goals || 0), 0);
    const totalAssists = adminPlayers.reduce((sum, player) => sum + (player.assists || 0), 0);
    const upcomingMatches = adminMatches.filter(match => match.status === 'upcoming').length;

    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('totalGoals').textContent = totalGoals;
    document.getElementById('totalAssists').textContent = totalAssists;
    document.getElementById('upcomingMatches').textContent = upcomingMatches;
};

// Load existing data
const loadAdminData = async () => {
    try {
        let rostersData = localStorage.getItem('adminPlayers');
        if (rostersData) {
            adminPlayers = JSON.parse(rostersData);
        } else {
            adminPlayers = [
                { id: 1, name: "Edrice Mujeyi", nickname: "Nawaz", position: "Forward", number: 25, goals: 25, assists: 8, playerImage: "../images/players/naw.jpg" },
                { id: 2, name: "Bleja", nickname: "Speed Demon", position: "Forward", number: 9, goals: 22, assists: 6, playerImage: "../images/players/bleja.jpg" }
            ];
            localStorage.setItem('adminPlayers', JSON.stringify(adminPlayers));
        }

        let matchesData = localStorage.getItem('adminMatches');
        if (matchesData) {
            adminMatches = JSON.parse(matchesData);
        }

        displayPlayersList();
        displayMatchesList();
        populatePlayerSelect();
        updateStatsOverview();
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
};

const displayPlayersList = () => {
    const container = document.getElementById('playersList');
    container.innerHTML = '';

    adminPlayers.forEach(player => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <div>
                <strong>${player.name}</strong> - #${player.number} (${player.position})
            </div>
            <div class="admin-actions">
                <button class="btn-edit" onclick="editPlayer(${player.id})">Edit</button>
                <button class="btn-delete" onclick="deletePlayer(${player.id})">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
};

const displayMatchesList = () => {
    const container = document.getElementById('matchesList');
    container.innerHTML = '';

    adminMatches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        const statusLabel = match.status ? match.status : 'upcoming';
        const scoreDisplay = (match.homeScore != null && match.awayScore != null) ? `${match.homeScore} - ${match.awayScore}` : (statusLabel === 'postponed' ? 'Postponed' : 'TBD');
        item.innerHTML = `
            <div>
                <strong>${match.homeTeam} vs ${match.awayTeam}</strong>
                <div class="match-meta">${match.date} • ${match.time || ''} • ${match.venue}</div>
                <div class="match-status">Status: <span class="status-tag status-${statusLabel}">${statusLabel.toUpperCase()}</span> • Score: <strong>${scoreDisplay}</strong></div>
            </div>
            <div class="admin-actions">
                <button class="btn-edit" onclick="editMatch(${match.id})">Edit</button>
                <button class="btn-action" onclick="togglePostponed(${match.id})">Toggle Postponed</button>
                <button class="btn-delete" onclick="deleteMatch(${match.id})">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
};

// Toggle postponed status quickly
const togglePostponed = (id) => {
    const match = adminMatches.find(m => m.id === id);
    if (!match) return;
    match.status = match.status === 'postponed' ? 'upcoming' : 'postponed';
    localStorage.setItem('adminMatches', JSON.stringify(adminMatches));
    displayMatchesList();
    updateStatsOverview();
};

const populatePlayerSelect = () => {
    const select = document.getElementById('statPlayerSelect');
    select.innerHTML = '';
    adminPlayers.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = player.name;
        select.appendChild(option);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();

    // Tab switching
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab') + '-tab').classList.add('active');
        });
    });

    // Position change handler for dynamic stats fields
    document.getElementById('playerPosition').addEventListener('change', (e) => {
        const position = e.target.value;
        const goalkeeperStats = document.getElementById('goalkeeperStats');
        const defenderStats = document.getElementById('defenderStats');

        // Hide all position-specific stats first
        goalkeeperStats.style.display = 'none';
        defenderStats.style.display = 'none';

        // Show relevant stats based on position
        if (position === 'Goalkeeper') {
            goalkeeperStats.style.display = 'block';
        } else if (position === 'Defender') {
            defenderStats.style.display = 'block';
        }
    });

    // Player form submit
    document.getElementById('playerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validatePlayerForm()) {
            return;
        }
        
        const playerId = document.getElementById('playerId').value;
        const position = document.getElementById('playerPosition').value;
        const newPlayer = {
            id: playerId ? parseInt(playerId) : Date.now(), // Use timestamp for unique ID
            name: document.getElementById('playerName').value.trim(),
            nickname: document.getElementById('playerNickname').value.trim(),
            position: position,
            number: parseInt(document.getElementById('playerNumber').value),
            goals: parseInt(document.getElementById('playerGoals').value),
            assists: parseInt(document.getElementById('playerAssists').value),
            playerImage: document.getElementById('playerImage').value || '../images/players/default.jpg'
        };

        // Add position-specific stats
        if (position === 'Goalkeeper') {
            newPlayer.SavePercentage = parseFloat(document.getElementById('playerSavePercentage').value) || 0;
            newPlayer.cleansheets = parseInt(document.getElementById('playerCleanSheets').value) || 0;
        } else if (position === 'Defender') {
            newPlayer.cleansheets = parseInt(document.getElementById('playerCleanSheetsDef').value) || 0;
        }

        if (playerId) {
            const index = adminPlayers.findIndex(p => p.id === parseInt(playerId));
            if (index > -1) {
                adminPlayers[index] = newPlayer;
            }
        } else {
            adminPlayers.push(newPlayer);
        }

        localStorage.setItem('adminPlayers', JSON.stringify(adminPlayers));
        document.getElementById('playerForm').reset();
        displayPlayersList();
        updateStatsOverview();
        populatePlayerSelect();
        alert('✅ Player saved successfully!');
    });

    // Match form submit
    document.getElementById('matchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateMatchForm()) {
            return;
        }
        
        const matchId = document.getElementById('matchId').value;
        const newMatch = {
            id: matchId ? parseInt(matchId) : Date.now(), // Use timestamp for unique ID
            homeTeam: document.getElementById('homeTeam').value.trim(),
            awayTeam: document.getElementById('awayTeam').value.trim(),
            date: document.getElementById('matchDate').value,
            time: document.getElementById('matchTime').value,
            venue: document.getElementById('matchVenue').value.trim(),
            status: document.getElementById('matchStatus').value,
            homeScore: document.getElementById('homeScore').value ? parseInt(document.getElementById('homeScore').value) : null,
            awayScore: document.getElementById('awayScore').value ? parseInt(document.getElementById('awayScore').value) : null,
            competition: document.getElementById('matchCompetition').value
        };

        if (matchId) {
            const index = adminMatches.findIndex(m => m.id === parseInt(matchId));
            if (index > -1) {
                adminMatches[index] = newMatch;
            }
        } else {
            adminMatches.push(newMatch);
        }

        localStorage.setItem('adminMatches', JSON.stringify(adminMatches));
        document.getElementById('matchForm').reset();
        displayMatchesList();
        updateStatsOverview();
        alert('✅ Match saved successfully!');
    });
});

const editPlayer = (id) => {
    const player = adminPlayers.find(p => p.id === id);
    if (player) {
        document.getElementById('playerId').value = player.id;
        document.getElementById('playerName').value = player.name;
        document.getElementById('playerNickname').value = player.nickname;
        document.getElementById('playerPosition').value = player.position;
        document.getElementById('playerNumber').value = player.number;
        document.getElementById('playerGoals').value = player.goals;
        document.getElementById('playerAssists').value = player.assists;
        document.getElementById('playerImage').value = player.playerImage;

        // Populate position-specific fields
        if (player.position === 'Goalkeeper') {
            document.getElementById('playerSavePercentage').value = player.SavePercentage || player.savePercentage || '';
            document.getElementById('playerCleanSheets').value = player.cleansheets || '';
        } else if (player.position === 'Defender') {
            document.getElementById('playerCleanSheetsDef').value = player.cleansheets || '';
        }

        // Trigger position change to show correct stats section
        document.getElementById('playerPosition').dispatchEvent(new Event('change'));
        window.scrollTo(0, 0);
    }
};

const deletePlayer = (id) => {
    const player = adminPlayers.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete "${player.name}"? This action cannot be undone.`)) {
        adminPlayers = adminPlayers.filter(p => p.id !== id);
        localStorage.setItem('adminPlayers', JSON.stringify(adminPlayers));
        displayPlayersList();
        updateStatsOverview();
        populatePlayerSelect();
    }
};

const editMatch = (id) => {
    const match = adminMatches.find(m => m.id === id);
    if (match) {
        document.getElementById('matchId').value = match.id;
        document.getElementById('homeTeam').value = match.homeTeam;
        document.getElementById('awayTeam').value = match.awayTeam;
        document.getElementById('matchDate').value = match.date;
        document.getElementById('matchTime').value = match.time;
        document.getElementById('matchVenue').value = match.venue;
        document.getElementById('matchStatus').value = match.status;
        document.getElementById('homeScore').value = match.homeScore || '';
        document.getElementById('awayScore').value = match.awayScore || '';
        document.getElementById('matchCompetition').value = match.competition || 'League';
        window.scrollTo(0, 0);
    }
};

const deleteMatch = (id) => {
    const match = adminMatches.find(m => m.id === id);
    if (confirm(`Are you sure you want to delete the match "${match.homeTeam} vs ${match.awayTeam}"? This action cannot be undone.`)) {
        adminMatches = adminMatches.filter(m => m.id !== id);
        localStorage.setItem('adminMatches', JSON.stringify(adminMatches));
        displayMatchesList();
        updateStatsOverview();
    }
};

const updatePlayerStats = () => {
    const playerId = parseInt(document.getElementById('statPlayerSelect').value);
    alert(`Stats update form for player ${playerId} would continue here`);
};
