let allMatches = [];

// ================= FETCH MATCHES =================
const fetchMatches = async () => {
    const container = document.getElementById('matchesContainer');
    container.innerHTML = `
        <div class="loading-matches">
            <div class="loading-spinner"></div>
            <p>Loading matches...</p>
        </div>
    `;

    try {
        // Load matches from JSON file
        const response = await fetch('data/matches.json');
        let jsonMatches = await response.json();

        // Load admin matches from localStorage
        let adminMatches = [];
        const adminMatchesData = localStorage.getItem('adminMatches');

        if (adminMatchesData) {
            adminMatches = JSON.parse(adminMatchesData).map(match => ({
                ...match,
                homeScore: match.homeScore ?? null,
                awayScore: match.awayScore ?? null,
                competition: match.competition || 'League'
            }));
        }

        // Merge matches
        allMatches = [...jsonMatches, ...adminMatches];

        // Sort matches by date
        allMatches.sort((a, b) => new Date(a.date) - new Date(b.date));

        displayMatches(allMatches, 'all');

    } catch (error) {
        console.error('Error fetching matches:', error);

        const adminMatchesData = localStorage.getItem('adminMatches');
        if (adminMatchesData) {
            allMatches = JSON.parse(adminMatchesData).map(match => ({
                ...match,
                homeScore: match.homeScore ?? null,
                awayScore: match.awayScore ?? null,
                competition: match.competition || 'League'
            }));
            displayMatches(allMatches, 'all');
        } else {
            container.innerHTML = `
                <div class="no-matches">
                    <div class="no-matches-icon">⚠️</div>
                    <h3>Unable to load matches</h3>
                    <p>Please check your connection and try again.</p>
                </div>
            `;
        }
    }
};

// ================= RENDER EVENTS =================
const renderEvents = (match, teamType) => {
    if (!match.events || match.events.length === 0) return '';

    const teamEvents = match.events.filter(event => event.team?.toLowerCase() === teamType.toLowerCase());

    if (teamEvents.length === 0) return '';

    return `
        <div class="team-events">
            ${teamEvents.map(event => {
                let icon = '';
                let text = '';

                switch(event.type) {
                    case "goal":
                        icon = "⚽";
                        text = `${event.player} ${event.minute}'${event.assist ? ` (A: ${event.assist})` : ''}`;
                        break;
                    case "penalty_goal":
                        icon = "⚽";
                        text = `${event.player} ${event.minute}' (P)`;
                        break;
                    case "own_goal":
                        icon = "⚽";
                        text = `${event.player} ${event.minute}' (OG)`;
                        break;
                    case "yellow_card":
                        icon = "🟨";
                        text = `${event.player} ${event.minute}'`;
                        break;
                    case "red_card":
                        icon = "🟥";
                        text = `${event.player} ${event.minute}'`;
                        break;
                    case "substitution":
                        icon = "🔁";
                        text = `${event.player_in} ↔ ${event.player_out}`;
                        break;
                }

                return `<div class="team-event">${icon} ${text}</div>`;
            }).join('')}
        </div>
    `;
};

// ================= DISPLAY MATCHES =================
const displayMatches = (matches, filter = 'all') => {
    const container = document.getElementById('matchesContainer');
    container.innerHTML = '';

    let filtered = matches;
    if (filter !== 'all') {
        filtered = matches.filter(match => match.status === filter);
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-matches">
                <div class="no-matches-icon">📅</div>
                <h3>No matches found</h3>
                <p>${filter === 'all' ? 'No matches available.' : `No ${filter} matches found.`}</p>
            </div>
        `;
        return;
    }

    filtered.forEach((match, index) => {
        const isCompleted = match.status === 'completed';
        const matchDate = new Date(match.date).toLocaleDateString('en-US', { 
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const matchElement = document.createElement('div');
        matchElement.className = `match-card ${isCompleted ? 'completed' : 'upcoming'}`;
        matchElement.style.animationDelay = `${index * 0.1}s`;

        matchElement.innerHTML = `
            <div class="match-date">
                <span class="day">${matchDate}</span>
                <span class="time">${match.time}</span>
                <span class="competition ${match.competition.toLowerCase()}">${match.competition}</span>
            </div>

            <div class="match-content">
                <div class="team home-team">
                    <span class="team-name">${match.homeTeam}</span>
                    ${isCompleted ? renderEvents(match,'home') : ''}
                </div>

                <div class="match-vs">
                    ${isCompleted 
                        ? `<span class="vs-score">${match.homeScore} - ${match.awayScore}</span>` 
                        : `<span class="vs-text">VS</span>`}
                </div>

                <div class="team away-team">
                    ${isCompleted ? renderEvents(match,'away') : ''}
                    <span class="team-name">${match.awayTeam}</span>
                </div>
            </div>

            <div class="match-venue">📍 ${match.venue}</div>
        `;

        container.appendChild(matchElement);
    });
};

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    fetchMatches();

    const filterButtons = document.querySelectorAll('.match-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter'); // all, completed, upcoming
            displayMatches(allMatches, filter);
        });
    });

    const refreshBtn = document.getElementById('refreshMatches');
    if(refreshBtn){
        refreshBtn.addEventListener('click', fetchMatches);
    }
});
