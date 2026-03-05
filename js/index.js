// Homepage JavaScript for dynamic content loading
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedPlayers();
    loadUpcomingMatches();
});

function loadFeaturedPlayers() {
    const featuredPlayersContainer = document.getElementById('featuredPlayers');

    // Load players from localStorage and JSON
    let players = [];

    // Try to load from localStorage first (admin-added players)
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
        players = JSON.parse(storedPlayers);
    }

    // Load from JSON file if no localStorage data
    if (players.length === 0) {
        fetch('../data/players.json')
            .then(response => response.json())
            .then(data => {
                players = data.players || [];
                displayFeaturedPlayers(players);
            })
            .catch(error => {
                console.error('Error loading players:', error);
                displayFeaturedPlayers([]);
            });
    } else {
        displayFeaturedPlayers(players);
    }
}

function displayFeaturedPlayers(players) {
    const container = document.getElementById('featuredPlayers');

    // Filter for star players (top performers)
    const starPlayers = players.filter(player =>
        player.position === 'Forward' || player.position === 'Midfielder' ||
        player.goals > 5 || player.assists > 3
    ).slice(0, 6); // Show max 6 players

    if (starPlayers.length === 0) {
        container.innerHTML = '<p class="no-data">Star players will be featured here</p>';
        return;
    }

    container.innerHTML = starPlayers.map(player => `
        <div class="player-card">
            <div class="player-avatar">
                <span class="position-badge">${getPositionAbbrev(player.position)}</span>
                ${player.image ? `<img src="${player.image}" alt="${player.name}" onerror="this.style.display='none'">` : ''}
                <div class="player-overlay"></div>
            </div>
            <div class="player-info">
                <h4>${player.name}</h4>
                <p class="player-position">${player.position}</p>
                <div class="player-stats">
                    <span>⚽ ${player.goals || 0}</span>
                    <span>🎯 ${player.assists || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getPositionAbbrev(position) {
    const abbrevs = {
        'Goalkeeper': 'GK',
        'Defender': 'DF',
        'Midfielder': 'MF',
        'Forward': 'FW'
    };
    return abbrevs[position] || position;
}

function loadUpcomingMatches() {
    const upcomingMatchesContainer = document.getElementById('upcomingMatches');

    // Load matches from localStorage and JSON
    let matches = [];

    // Try to load from localStorage first (admin-added matches)
    const storedMatches = localStorage.getItem('matches');
    if (storedMatches) {
        matches = JSON.parse(storedMatches);
    }

    // Load from JSON file if no localStorage data
    if (matches.length === 0) {
        fetch('../data/matches.json')
            .then(response => response.json())
            .then(data => {
                matches = data.matches || [];
                displayUpcomingMatches(matches);
            })
            .catch(error => {
                console.error('Error loading matches:', error);
                displayUpcomingMatches([]);
            });
    } else {
        displayUpcomingMatches(matches);
    }
}

function displayUpcomingMatches(matches) {
    const container = document.getElementById('upcomingMatches');

    // Filter for upcoming matches (future dates)
    const now = new Date();
    const upcomingMatches = matches
        .filter(match => new Date(match.date) > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); // Show next 3 matches

    if (upcomingMatches.length === 0) {
        container.innerHTML = '<p class="no-data">No upcoming matches scheduled</p>';
        return;
    }

    container.innerHTML = upcomingMatches.map(match => `
        <div class="match-preview">
            <div class="match-date">
                <span class="day">${new Date(match.date).getDate()}</span>
                <span class="month">${new Date(match.date).toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
            <div class="match-details">
                <div class="match-teams">
                    <span class="home-team">${match.homeTeam}</span>
                    <span class="vs">vs</span>
                    <span class="away-team">${match.awayTeam}</span>
                </div>
                <div class="match-info">
                    <span class="time">${match.time || 'TBD'}</span>
                    <span class="venue">${match.venue || 'TBD'}</span>
                </div>
            </div>
        </div>
    `).join('');
}