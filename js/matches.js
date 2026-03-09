let allMatches = [];

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
            adminMatches = JSON.parse(adminMatchesData);

            adminMatches = adminMatches.map(match => ({
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


const renderEvents = (match) => {

    if (!match.events || match.events.length === 0) return '';

    let html = `<div class="match-events">`;

    match.events.forEach(event => {

        let icon = '';
        let text = '';

        switch(event.type){

            case "goal":
                icon = "⚽";
                text = `${event.player} ${event.assist ? `(Assist: ${event.assist})` : ''}`;
                break;

            case "penalty_goal":
                icon = "⚽";
                text = `${event.player} (P)`;
                break;

            case "own_goal":
                icon = "⚽";
                text = `${event.player} (OG)`;
                break;

            case "yellow_card":
                icon = "🟨";
                text = event.player;
                break;

            case "red_card":
                icon = "🟥";
                text = event.player;
                break;

            case "substitution":
                icon = "🔁";
                text = `${event.player_in} ↔ ${event.player_out}`;
                break;
        }

        html += `
            <div class="event">
                <span class="minute">${event.minute}'</span>
                <span class="icon">${icon}</span>
                <span class="text">${text}</span>
            </div>
        `;
    });

    html += `</div>`;

    return html;
};


const displayMatches = (matches, filter) => {

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
                <p>${filter === 'all' ? 'No matches available at the moment.' : `No ${filter} matches found.`}</p>
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
                    ${isCompleted ? `<span class="score">${match.homeScore}</span>` : '<span class="score">-</span>'}
                </div>

                <div class="match-vs">
                    ${isCompleted ? `
                        <span class="vs-score">${match.homeScore} - ${match.awayScore}</span>
                    ` : `
                        <span class="vs-text">vs</span>
                    `}
                </div>

                <div class="team away-team">
                    ${isCompleted ? `<span class="score">${match.awayScore}</span>` : '<span class="score">-</span>'}
                    <span class="team-name">${match.awayTeam}</span>
                </div>
            </div>

            <div class="match-venue">
                <span>📍 ${match.venue}</span>
            </div>

            ${isCompleted ? renderEvents(match) : ''}
        `;

        container.appendChild(matchElement);
    });
};


document.addEventListener('DOMContentLoaded', () => {

    fetchMatches();

    const filterButtons = document.querySelectorAll('.match-filter-btn');

    filterButtons.forEach(btn => {

        btn.addEventListener('click', () => {

            filterButtons.forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            displayMatches(allMatches, filter);
        });
    });

    document.getElementById('refreshMatches').addEventListener('click', () => {
        fetchMatches();
    });

});
