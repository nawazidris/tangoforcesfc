const loadClubHistory = async () => {
    // First try to read inline JSON (useful when opening pages locally without a server)
    try {
        const inline = document.getElementById('clubHistoryData');
        if (inline) {
            const data = JSON.parse(inline.textContent);
            displayClubInfo(data);
            displaySeasonStats(data.seasonStats);
            displayPhilosophy(data.clubPhilosophy);
            displayAchievements(data.achievements);
            displayTimeline(data.milestones);
            return;
        }
    } catch (e) {
        console.warn('Inline club history JSON is invalid or missing, will attempt fetch.');
    }

    // Fallback to fetching the JSON (works when served over HTTP)
    try {
        const response = await fetch('../data/club-history.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayClubInfo(data);
        displaySeasonStats(data.seasonStats);
        displayPhilosophy(data.clubPhilosophy);
        displayAchievements(data.achievements);
        displayTimeline(data.milestones);
    } catch (error) {
        console.error('Error loading club history:', error);
        // Render a friendly message so the page isn't blank
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = '<section class="error"><h3>Unable to load club history</h3><p>Please open this site using a local server (e.g. Live Server) or contact the site administrator.</p></section>';
        }
    }
};

const displayClubInfo = (data) => {
    const container = document.getElementById('clubInfo');
    container.innerHTML = `
        <div class="club-details">
            <h3>${data.club}</h3>
            <p><strong>Founded:</strong> ${data.foundedYear}</p>
            <p><strong>Stadium:</strong> ${data.stadium} (Capacity: ${data.capacity.toLocaleString()})</p>
            <p><strong>Description:</strong></p>
            <p>${data.description}</p>
        </div>
    `;
};

const displaySeasonStats = (seasonStats) => {
    const container = document.getElementById('seasonStatsContainer');
    const season = seasonStats['2025_26'];

    container.innerHTML = `
        <div class="season-overview">
            <div class="league-info">
                <h4>${season.league} ${season.position} Place</h4>
                <div class="stats-grid">
                    <div class="stat-box">
                        <span class="stat-number">${season.played}</span>
                        <span class="stat-label">Played</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${season.won}</span>
                        <span class="stat-label">Won</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${season.drawn}</span>
                        <span class="stat-label">Drawn</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${season.lost}</span>
                        <span class="stat-label">Lost</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${season.points}</span>
                        <span class="stat-label">Points</span>
                    </div>
                </div>
            </div>
            <div class="top-scorers">
                <h4>Top Goal Scorers</h4>
                <div class="scorers-list">
                    ${season.topScorers.map((scorer, index) => `
                        <div class="scorer-item">
                            <span class="scorer-rank">#${index + 1}</span>
                            <span class="scorer-name">${scorer.name}</span>
                            <span class="scorer-goals">${scorer.goals} goals</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
};

const displayPhilosophy = (philosophy) => {
    const container = document.getElementById('philosophyContainer');
    container.innerHTML = `
        <div class="philosophy-content">
            <div class="philosophy-intro">
                <h4>${philosophy.title}</h4>
                <p>${philosophy.description}</p>
            </div>
            <div class="philosophy-pillars">
                ${philosophy.pillars.map(pillar => `
                    <div class="pillar-card">
                        <h5>${pillar.name}</h5>
                        <p>${pillar.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

const displayAchievements = (achievements) => {
    const container = document.getElementById('achievementsContainer');
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.innerHTML = `
            <div class="achievement-year">${achievement.year}</div>
            <div class="achievement-content">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        container.appendChild(card);
    });
};

const displayTimeline = (milestones) => {
    const container = document.getElementById('timelineContainer');
    container.innerHTML = '';
    
    milestones.forEach((milestone, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">${milestone}</div>
        `;
        container.appendChild(item);
    });
};

document.addEventListener('DOMContentLoaded', loadClubHistory);
