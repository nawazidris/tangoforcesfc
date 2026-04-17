let allMatches = [];

/* ================= HELPER: GET PLAYER NAME ================= */
function getPlayerName(id){
    const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '[]');
    const p = allPlayers.find(x => x.id === id);
    return p ? p.name : "Unknown";
}

function getPlayerById(id){
    const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '[]');
    const adminPlayers = JSON.parse(localStorage.getItem('adminPlayers') || '[]');
    return adminPlayers.find(x => x.id === id) || allPlayers.find(x => x.id === id);
}

function getPlayerByName(playerName){
    if(!playerName) return null;
    const normalized = playerName.trim().toLowerCase();
    const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '[]');
    const adminPlayers = JSON.parse(localStorage.getItem('adminPlayers') || '[]');
    return [...adminPlayers, ...allPlayers].find(p =>
        (p.name && p.name.trim().toLowerCase() === normalized) ||
        (p.nickname && p.nickname.trim().toLowerCase() === normalized)
    );
}

function getPlayerDisplayName(event){
    const playerName = event.playerId ? getPlayerName(event.playerId) : event.player || 'Unknown';
    const player = event.playerId ? getPlayerById(event.playerId) : getPlayerByName(playerName);
    if(player && player.nickname){
        return player.nickname;
    }
    return formatEventName(playerName);
}

function formatEventName(fullName){
    if(!fullName) return 'Unknown';
    return fullName.split(' ')[0];
}

function getSeasonLabel(dateString){
    const date = new Date(dateString);
    if(isNaN(date)) return 'Season';
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if(month >= 3) return `${year} Season`;
    return `${year - 1}/${year} Season`;
}

/* ================= FETCH MATCHES ================= */
const fetchMatches = async () => {
    const container = document.getElementById('matchesContainer');
    container.innerHTML = `<div class="loading-matches"><p>Loading matches...</p></div>`;

    try {
        // Fetch static JSON
        const response = await fetch('data/matches.json');
        let jsonMatches = await response.json();

        // Get admin matches from localStorage
        let adminMatches = [];
        const adminMatchesData = localStorage.getItem('adminMatches');

        if (adminMatchesData) {
            adminMatches = JSON.parse(adminMatchesData).map(match => ({
                ...match,
                homeScore: match.homeScore ?? null,
                awayScore: match.awayScore ?? null,
                competition: match.competition || 'League',
                events: match.events || []
            }));
        }

        // Merge both
        allMatches = [...jsonMatches, ...adminMatches];

        // Sort by date
        allMatches.sort((a,b) => new Date(a.date) - new Date(b.date));

        displayMatches(allMatches, 'all');

    } catch (error) {
        console.error('Error fetching matches:', error);

        // fallback to admin matches only
        const adminMatchesData = localStorage.getItem('adminMatches');

        if(adminMatchesData){
            allMatches = JSON.parse(adminMatchesData).map(match => ({
                ...match,
                homeScore: match.homeScore ?? null,
                awayScore: match.awayScore ?? null,
                competition: match.competition || 'League',
                events: match.events || []
            }));

            displayMatches(allMatches, 'all');
        } else {
            container.innerHTML = `<div class="no-matches"><h3>Unable to load matches</h3></div>`;
        }
    }
};

/* ================= DISPLAY MATCHES ================= */
const displayMatches = (matches, filter='all') => {
    const container = document.getElementById('matchesContainer');
    container.innerHTML = '';

    let filtered = matches;

    if(filter !== 'all'){
        filtered = matches.filter(m => m.status === filter);
    }

    if(filtered.length === 0){
        container.innerHTML = `<p class="no-matches-text">No matches found</p>`;
        return;
    }

    filtered.forEach(match => {
        const isCompleted = match.status === 'completed';
        const matchDate = new Date(match.date).toLocaleDateString(undefined, {
            day: 'numeric', month: 'short'
        });

        const matchCard = document.createElement('div');
        matchCard.className = `match-card ${isCompleted ? 'completed' : 'upcoming'}`;

        const homeEvents = renderEvents(match, 'home');
        const awayEvents = renderEvents(match, 'away');
        const hasEvents = homeEvents || awayEvents;

        matchCard.className = `mobile-card ${isCompleted ? 'completed' : 'upcoming'}`;
        matchCard.innerHTML = `
            <div class="mobile-header">
                <span>🏆 ${match.competition || 'League'}</span>
                <span>🏟️ ${match.venue ? match.venue.substring(0, 24) : 'TBA'}</span>
            </div>
            <div class="mobile-main">
                <div class="team">${match.homeTeam}</div>
                <div class="score">${isCompleted ? `${match.homeScore}–${match.awayScore}` : 'VS'}</div>
                <div class="team">${match.awayTeam}</div>
            </div>
            ${hasEvents ? `
            <div class="mobile-events">
                <div class="event-column left">
                    ${homeEvents}
                </div>
                <div class="event-column right">
                    ${awayEvents}
                </div>
            </div>
            ` : ''}
        `;

        container.appendChild(matchCard);
    });
};

/* ================= RENDER EVENTS ================= */
const renderEvents = (match, teamType) => {

    if(!match.events || match.events.length === 0) return '';

    const teamEvents = match.events.filter(
        e => e.team && e.team.toLowerCase() === teamType.toLowerCase()
    );

    if(teamEvents.length === 0) return '';

    return teamEvents.map(e => {

        let icon = '';
        let text = '';
        let className = '';

        const displayName = getPlayerDisplayName(e);
        const assistPlayer = e.assist ? getPlayerDisplayName({ player: e.assist }) : e.assist;
        const playerOut = e.player_out ? getPlayerDisplayName({ player: e.player_out }) : e.player_out;
        const playerIn = e.player_in ? getPlayerDisplayName({ player: e.player_in }) : e.player_in;

        switch(e.type){
            case "goal":
                icon = "⚽";
                text = `${displayName}`;
                if(e.minute) text += ` ${e.minute}'`;
                if(e.assist){
                    text += ` (${assistPlayer})`;
                }
                className = "event-goal";
                break;

            case "assist":
                icon = "🎯";
                text = `${displayName}`;
                if(e.minute) text += ` ${e.minute}'`;
                className = "event-assist";
                break;

            case "yellow_card":
                icon = "🟨";
                text = `${displayName}`;
                if(e.minute) text += ` ${e.minute}'`;
                className = "event-yellow";
                break;

            case "red_card":
                icon = "🟥";
                text = `${displayName}`;
                if(e.minute) text += ` ${e.minute}'`;
                className = "event-red";
                break;

            case "substitution":
                icon = "🔁";
                text = `${playerOut} ↔ ${playerIn}`;
                className = "event-sub";
                break;
        }

        return `<div class="team-event ${className}">
            ${icon} ${text}
        </div>`;
    }).join('');
};

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {

    fetchMatches();

    // FILTER BUTTONS
    const filterButtons = document.querySelectorAll('.match-filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            displayMatches(allMatches, filter);
        });
    });

    // REFRESH BUTTON
    const refreshBtn = document.getElementById('refreshMatches');

    if(refreshBtn){
        refreshBtn.addEventListener('click', fetchMatches);
    }
});