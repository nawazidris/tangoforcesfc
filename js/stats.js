const fetchPlayerStats = async () => {
    try {
        const response = await fetch('../data/players.json');
        const data = await response.json();
        displayPlayerStats(data);
    } catch (error) {
        console.error('Error fetching player stats:', error);
    }
};

const displayPlayerStats = (players) => {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';

    players.forEach(player => {
        const playerStats = document.createElement('div');
        playerStats.classList.add('player-stats');
        playerStats.innerHTML = `
            <h3>${player.name}</h3>
            <p>Position: ${player.position}</p>
            <p>Games Played: ${player.stats.gamesPlayed}</p>
            <p>Goals: ${player.stats.goals}</p>
            <p>Assists: ${player.stats.assists}</p>
            <p>Points: ${player.stats.points}</p>
        `;
        statsContainer.appendChild(playerStats);
    });
};

document.addEventListener('DOMContentLoaded', fetchPlayerStats);