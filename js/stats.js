let statsPlayers = [];

const fetchPlayerStats = async () => {
    try {
        const response = await fetch('data/players.json');
        const data = await response.json();
        statsPlayers = data;
        updateStatsSummary(data);
        populateFilterOptions(data);
        displayTopScorers(data);
        renderGoalsAssistsChart(data);
        renderStatsTable(data);
        loadLeagueStandings();
    } catch (error) {
        console.error('Error fetching player stats:', error);
    }
};

const renderStatsTable = (players) => {
    const statsBody = document.querySelector('#stats-table tbody');
    if (!statsBody) return;
    statsBody.innerHTML = '';

    players.forEach(player => {
        const stats = player.stats || {};
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${player.name || 'Unknown'}</td>
            <td>${player.position || '-'}</td>
            <td>${stats.goals ?? '-'}</td>
            <td>${stats.assists ?? '-'}</td>
        `;
        statsBody.appendChild(row);
    });
};

const updateStatsSummary = (players) => {
    const leagueSummary = getLeagueSummary();
    const totalGoals = players.reduce((sum, player) => sum + (player.stats?.goals || 0), 0);
    const totalGoalsAgainst = players.reduce((sum, player) => sum + (player.stats?.goalsAgainst || 0), 0);
    const totalMatches = leagueSummary?.matchesPlayed ?? players.reduce((sum, player) => sum + (player.stats?.gamesPlayed || 0), 0);
    const goalDiff = (leagueSummary?.goalDifference ?? (totalGoals - totalGoalsAgainst));

    document.getElementById('summaryMatches').textContent = totalMatches;
    document.getElementById('summaryGoalsFor').textContent = leagueSummary?.goalsFor ?? totalGoals;
    document.getElementById('summaryGoalsAgainst').textContent = leagueSummary?.goalsAgainst ?? totalGoalsAgainst;
    document.getElementById('summaryGoalDiff').textContent = goalDiff;
};

const getLeagueSummary = () => {
    try {
        const raw = localStorage.getItem('leagueStandingsJson');
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.headers || !parsed.rows || !parsed.rows.length) return null;

        const tangoRow = parsed.rows.find(row => row.some(cell => String(cell).toLowerCase().includes('tango fc')));
        if (!tangoRow || tangoRow.length < 10) return null;

        const [position, ...teamAndStats] = tangoRow;
        const stats = teamAndStats.slice(-8);
        const goalsFor = Number(stats[4]) || 0;
        const goalsAgainst = Number(stats[5]) || 0;
        const matchesPlayed = Number(stats[0]) || 0;
        const goalDifference = Number(stats[6]) || goalsFor - goalsAgainst;

        return {
            position: Number(position) || null,
            matchesPlayed,
            goalsFor,
            goalsAgainst,
            goalDifference,
            points: Number(stats[7]) || 0
        };
    } catch (error) {
        console.warn('League summary parse failed:', error);
        return null;
    }
};

const populateFilterOptions = (players) => {
    const teams = [...new Set(players.map(player => player.team).filter(Boolean))].sort();
    const positions = [...new Set(players.map(player => player.position).filter(Boolean))].sort();

    const teamFilter = document.getElementById('teamFilter');
    const positionFilter = document.getElementById('positionFilter');

    if (teamFilter) {
        teamFilter.innerHTML = '<option value="">All Teams</option>' + teams.map(team => `<option value="${team}">${team}</option>`).join('');
    }

    if (positionFilter) {
        positionFilter.innerHTML = '<option value="">All Positions</option>' + positions.map(position => `<option value="${position}">${position}</option>`).join('');
    }
};

const setupStatsControls = () => {
    const searchInput = document.getElementById('statsSearchInput');
    const teamFilter = document.getElementById('teamFilter');
    const positionFilter = document.getElementById('positionFilter');

    [searchInput, teamFilter, positionFilter].forEach(control => {
        if (control) {
            control.addEventListener('input', applyStatFilters);
        }
    });
};

const applyStatFilters = () => {
    const searchTerm = document.getElementById('statsSearchInput')?.value.toLowerCase().trim() || '';
    const team = document.getElementById('teamFilter')?.value || '';
    const position = document.getElementById('positionFilter')?.value || '';

    const filtered = statsPlayers.filter(player => {
        const name = player.name?.toLowerCase() || '';
        const teamValue = player.team?.toLowerCase() || '';
        const positionValue = player.position?.toLowerCase() || '';
        const matchesSearch = !searchTerm || name.includes(searchTerm) || teamValue.includes(searchTerm) || positionValue.includes(searchTerm);
        const matchesTeam = !team || player.team === team;
        const matchesPosition = !position || player.position === position;
        return matchesSearch && matchesTeam && matchesPosition;
    });

    renderStatsTable(filtered);
};

const displayTopScorers = (players) => {
    const container = document.getElementById('topScorersContainer');
    if (!container) return;

    const topScorers = [...players]
        .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0) || (b.stats?.assists || 0) - (a.stats?.assists || 0))
        .slice(0, 5);

    if (topScorers.length === 0) {
        container.innerHTML = '<p>No player stats available.</p>';
        return;
    }

    container.innerHTML = topScorers.map(player => {
        const goals = player.stats?.goals ?? 0;
        const assists = player.stats?.assists ?? 0;
        return `
            <div class="top-scorer-card">
                <div class="top-scorer-name">${player.name || 'Unknown'}</div>
                <div class="top-scorer-meta">${player.position || 'Player'} • ${player.team || 'Team'}</div>
                <div class="top-scorer-stats">
                    <span>⚽ ${goals} goals</span>
                    <span>🎯 ${assists} assists</span>
                </div>
            </div>
        `;
    }).join('');
};

const renderGoalsAssistsChart = (players) => {
    const container = document.getElementById('goalsAssistsChart');
    if (!container) return;

    const totalGoals = players.reduce((sum, player) => sum + (player.stats?.goals || 0), 0);
    const totalAssists = players.reduce((sum, player) => sum + (player.stats?.assists || 0), 0);
    const maxValue = Math.max(totalGoals, totalAssists, 1);

    container.innerHTML = `
        <div class="chart-row">
            <span class="chart-label">Goals</span>
            <div class="chart-track"><div class="chart-bar goals" style="width:${(totalGoals / maxValue) * 100}%"></div></div>
            <span class="chart-value">${totalGoals}</span>
        </div>
        <div class="chart-row">
            <span class="chart-label">Assists</span>
            <div class="chart-track"><div class="chart-bar assists" style="width:${(totalAssists / maxValue) * 100}%"></div></div>
            <span class="chart-value">${totalAssists}</span>
        </div>
    `;
};

const loadLeagueStandings = () => {
    const summary = getLeagueSummary();
    if (summary) {
        document.getElementById('summaryMatches').textContent = summary.matchesPlayed;
        document.getElementById('summaryGoalsFor').textContent = summary.goalsFor;
        document.getElementById('summaryGoalsAgainst').textContent = summary.goalsAgainst;
        document.getElementById('summaryGoalDiff').textContent = summary.goalDifference;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchPlayerStats();
    setupStatsControls();
});