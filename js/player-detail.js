const getPlayerFromRoster = async (playerId) => {
    // First try localStorage (most reliable)
    const selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer') || '{}');
    if (selectedPlayer && selectedPlayer.id === parseInt(playerId)) {
        return selectedPlayer;
    }

    // Fallback to allPlayers array
    const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '[]');
    return allPlayers.find(p => p.id === parseInt(playerId));
};

const displayPlayerProfile = (player) => {
    if (!player) {
        document.getElementById('playerProfile').innerHTML = '<p>Player not found</p>';
        return;
    }

    const container = document.getElementById('playerProfile');
    container.innerHTML = `
        <div class="profile-container">
            <button class="back-btn" onclick="history.back()">← Back</button>
            <div class="profile-header">
                <div class="profile-image">
                    <img src="${player.playerImage}" alt="${player.name}">
                </div>
                <div class="profile-info">
                    <h1>${player.name} ${player.isNewSigning ? '<span class="new-signing-indicator">⭐ NEW</span>' : ''}</h1>
                    <p class="nickname">Nickname: "${player.nickname}"</p>
                    <p class="position">Position: ${player.position}</p>
                    <p class="number">Jersey #${player.number}</p>
                </div>
            </div>

            <div class="profile-stats">
                <h3>Career Statistics</h3>
                <div class="stats-grid">
                    ${player.position === 'Goalkeeper' ? `
                        <div class="stat-box">
                            <span class="stat-label">Save %</span>
                            <span class="stat-number">${player.SavePercentage || player.savePercentage || 0}%</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Clean Sheets</span>
                            <span class="stat-number">${player.cleansheets || 0}</span>
                        </div>
                    ` : player.position === 'Defender' ? `
                        <div class="stat-box">
                            <span class="stat-label">Goals</span>
                            <span class="stat-number">${player.goals || 0}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Assists</span>
                            <span class="stat-number">${player.assists || 0}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Clean Sheets</span>
                            <span class="stat-number">${player.cleansheets || 0}</span>
                        </div>
                    ` : `
                        <div class="stat-box">
                            <span class="stat-label">Goals</span>
                            <span class="stat-number">${player.goals || 0}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">Assists</span>
                            <span class="stat-number">${player.assists || 0}</span>
                        </div>
                    `}
                </div>
            </div>

            <div class="profile-actions">
                <button class="vote-btn" onclick="voteForPlayer(${player.id}, '${player.name}')">Vote for Player of the Month</button>
            </div>
        </div>
    `;
};

const voteForPlayer = (playerId, playerName) => {
    const votes = JSON.parse(localStorage.getItem('playerVotes') || '{}');
    votes[playerId] = (votes[playerId] || 0) + 1;
    localStorage.setItem('playerVotes', JSON.stringify(votes));
    alert(`✓ You voted for ${playerName}!`);
};

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const playerId = params.get('id');

    if (!playerId) {
        // Try to get from localStorage as fallback
        const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '[]');
        if (allPlayers.length > 0) {
            displayPlayerProfile(allPlayers[0]);
        }
        return;
    }

    const player = await getPlayerFromRoster(playerId);
    displayPlayerProfile(player);
});
