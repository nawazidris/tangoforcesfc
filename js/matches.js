let allMatches = [];

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

        allMatches = [...jsonMatches, ...adminMatches];
        allMatches.sort((a,b) => new Date(a.date) - new Date(b.date));

        displayMatches(allMatches, 'all');

    } catch (error) {
        console.error('Error fetching matches:', error);

        // Fallback to admin matches only
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
        container.innerHTML = `<p>No matches found</p>`;
        return;
    }

    filtered.forEach(match => {
        const isCompleted = match.status === 'completed';
        const matchDate = new Date(match.date).toLocaleDateString();

        const matchElement = document.createElement('div');
        matchElement.className = `match-card ${isCompleted ? 'completed' : 'upcoming'}`;

        matchElement.innerHTML = `
            <div class="match-date">${matchDate} | ${match.time || ''}</div>
            <div class="match-content">
                <div class="team home-team">
                    <span>${match.homeTeam}</span>
                    ${renderEvents(match, 'home')}
                </div>
                <div class="vs">${isCompleted ? `${match.homeScore} - ${match.awayScore}` : 'VS'}</div>
                <div class="team away-team">
                    ${renderEvents(match, 'away')}
                    <span>${match.awayTeam}</span>
                </div>
            </div>
            <div class="venue">📍 ${match.venue || ''}</div>
        `;
        container.appendChild(matchElement);
    });
};

/* ================= RENDER EVENTS ================= */
const renderEvents = (match, teamType) => {
    if(!match.events || match.events.length === 0) return '';
    const teamEvents = match.events.filter(e => e.team.toLowerCase() === teamType.toLowerCase());
    if(teamEvents.length === 0) return '';

    return `<div class="team-events">
        ${teamEvents.map(e => {
            let icon='', text='', className='';
            switch(e.type){
                case "goal":
                    icon="⚽"; text=`${e.player} ${e.minute}'`; className="event-goal"; break;
                case "assist":
                    icon="🎯"; text=`${e.player} ${e.minute}'`; className="event-assist"; break;
                case "yellow_card":
                    icon="🟨"; text=`${e.player} ${e.minute}'`; className="event-yellow"; break;
                case "red_card":
                    icon="🟥"; text=`${e.player} ${e.minute}'`; className="event-red"; break;
                case "substitution":
                    icon="🔁"; text=`${e.player_out} ↔ ${e.player_in}`; className="event-sub"; break;
            }
            return `<div class="team-event ${className}">${icon} ${text}</div>`;
        }).join('')}
    </div>`;
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