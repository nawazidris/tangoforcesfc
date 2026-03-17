let allMatches = [];

/* ================= FETCH MATCHES ================= */

const fetchMatches = async () => {

    const container = document.getElementById('matchesContainer');

    container.innerHTML = `
        <div class="loading-matches">
            <p>Loading matches...</p>
        </div>
    `;

    try {

        const response = await fetch('data/matches.json');
        let jsonMatches = await response.json();

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

        allMatches = [...jsonMatches, ...adminMatches];

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
                competition: match.competition || 'League',
                events: match.events || []
            }));

            displayMatches(allMatches, 'all');

        } else {

            container.innerHTML = `
                <div class="no-matches">
                    <h3>Unable to load matches</h3>
                </div>
            `;
        }
    }
};

/* ================= RENDER EVENTS ================= */

const renderEvents = (match, teamType) => {

    if (!match.events || match.events.length === 0) return '';

    const teamEvents = match.events.filter(
        e => e.team && e.team.toLowerCase() === teamType.toLowerCase()
    );

    if (teamEvents.length === 0) return '';

    return `
        <div class="team-events">
            ${teamEvents.map(event => {

                let icon = '';
                let text = '';

                switch(event.type) {

                    case "goal":
                        icon = "⚽";
                        text = `${event.player} ${event.minute}'`;
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

/* ================= DISPLAY MATCHES ================= */

const displayMatches = (matches, filter = 'all') => {

    const container = document.getElementById('matchesContainer');
    container.innerHTML = '';

    let filtered = matches;

    if (filter !== 'all') {
        filtered = matches.filter(match => match.status === filter);
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p>No matches found</p>`;
        return;
    }

    filtered.forEach((match, index) => {

        const isCompleted = match.status === 'completed';

        const matchDate = new Date(match.date).toLocaleDateString();

        const matchElement = document.createElement('div');
        matchElement.className = `match-card ${isCompleted ? 'completed' : 'upcoming'}`;

        matchElement.innerHTML = `
            <div class="match-date">
                ${matchDate} | ${match.time || ''}
            </div>

            <div class="match-content">

                <div class="team home-team">
                    <span>${match.homeTeam}</span>
                    ${renderEvents(match, 'home')}
                </div>

                <div class="vs">
                    ${
                        isCompleted
                        ? `${match.homeScore} - ${match.awayScore}`
                        : "VS"
                    }
                </div>

                <div class="team away-team">
                    ${renderEvents(match, 'away')}
                    <span>${match.awayTeam}</span>
                </div>

            </div>

            <div class="venue">
                📍 ${match.venue || ''}
            </div>
        `;

        container.appendChild(matchElement);
    });
};

/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', () => {

    fetchMatches();

    const filterButtons = document.querySelectorAll('.match-filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            displayMatches(allMatches, filter);
        });
    });

    const refreshBtn = document.getElementById('refreshMatches');

    if(refreshBtn){
        refreshBtn.addEventListener('click', fetchMatches);
    }
});
