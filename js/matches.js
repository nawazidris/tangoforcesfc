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
        const response = await fetch('../data/matches.json');
        let jsonMatches = await response.json();

        // Load admin matches from localStorage
        let adminMatches = [];
        const adminMatchesData = localStorage.getItem('adminMatches');
        if (adminMatchesData) {
            adminMatches = JSON.parse(adminMatchesData);
            // Add missing fields for admin matches to match JSON structure
            adminMatches = adminMatches.map(match => ({
                ...match,
                homeScore: match.homeScore || null,
                awayScore: match.awayScore || null,
                competition: match.competition || 'League' // Default to League
            }));
        }

        // Merge JSON matches and admin matches
        allMatches = [...jsonMatches, ...adminMatches];

        // Sort by date (chronological order - oldest first)
        allMatches.sort((a, b) => new Date(a.date) - new Date(b.date));

        displayMatches(allMatches, 'all');
    } catch (error) {
        console.error('Error fetching matches:', error);
        // Fallback: try to load just admin matches if JSON fails
        const adminMatchesData = localStorage.getItem('adminMatches');
        if (adminMatchesData) {
            allMatches = JSON.parse(adminMatchesData).map(match => ({
                ...match,
                homeScore: match.homeScore || null,
                awayScore: match.awayScore || null,
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

    // Refresh button functionality
    document.getElementById('refreshMatches').addEventListener('click', () => {
        fetchMatches();
    });
});
