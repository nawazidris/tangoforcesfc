const basePlayers = [
    // Forwards
    { id: 1, name: "Edrice Mujeyi", nickname: "Nawaz", position: "Forward", number: 15, goals: 25, assists: 8, playerImage: "images/idris.jpg" },
    { id: 2, name: "Blessing Zvinoitavamwe", nickname: "Bleja", position: "Forward", number: 9, goals: 22, assists: 6, playerImage: "images/bleja.jpg" },
    { id: 3, name: "Abel Makuvise", nickname: "Svari", position: "Forward", number: 11, goals: 18, assists: 5, playerImage: "images/svari1.jpg" },
    { id: 4, name: "Vincent Mukumba", nickname: "Vincho", position: "Forward", number: 7, goals: 20, assists: 7, playerImage: "images/vincho.jpg" },
    { id: 5, name: "Shephard Mukarati", nickname: "PSG", position: "Forward", number: 17, goals: 19, assists: 9, playerImage: "images/psg.jpg" },
    { id: 6, name: "Simbarashe Borerwa", nickname: "Jah Bhora", position: "Forward", number: 17, goals: 19, assists: 9, playerImage: "images/jahbhora.jpg" },
    { id: 7, name: "Godfrey Rwodzi", nickname: "Goda", position: "Forward", number: 19, goals: 15, assists: 8, playerImage: "images/goda.jpg" },

    // Midfielders
    { id: 8, name: "Alious Jamela", nickname: "Bambo", position: "Midfielder", number: 8, goals: 12, assists: 15, playerImage: "images/jamela.jpg" },
    { id: 9, name: "Delight Mwadira", nickname: "Mashefu", position: "Midfielder", number: 13, goals: 8, assists: 18, playerImage: "images/delo.jpg" },
    { id: 10, name: "Milton Bosha ", nickname: "Milito", position: "Midfielder", number: 4, goals: 10, assists: 16, playerImage: "images/milito1.jpg" },
    { id: 11, name: "Providence Mashuro", nickname: "Shule", position: "Midfielder", number: 17, goals: 6, assists: 12, playerImage: "images/shule.jpg" },
    { id: 12, name: "Blessed Shoko", nickname: "Tsoko", position: "Midfielder", number: 14, goals: 7, assists: 14, playerImage: "images/shoko.jpg" },
    { id: 13, name: "Edward Mapuranga", nickname: "Dos", position: "Midfielder", number: 14, goals: 7, assists: 14, playerImage: "images/dos.jpg" },
    { id: 14, name: "Abisha Gideon", nickname: "Yaya", position: "Midfielder", number: 14, goals: 7, assists: 14, playerImage: "images/yaya.jpg" },
    { id: 15, name: "Author Masocha", nickname: "Levels", position: "Midfielder", number: 14, goals: 7, assists: 14, playerImage: "images/levels.jpg" },
    { id: 16, name: "Tafadzwa Jimere", nickname: "Jimere", position: "Midfielder", number: 16, goals: 5, assists: 10, playerImage: "images/jimere.jpg" },

    // Defenders
    { id: 17, name: "Lordship Sithole", nickname: "Lord", position: "Defender", number: 5, goals: 2, assists: 3, cleansheets:16, playerImage: "images/lord.jpg" },
    { id: 18, name: "Nokutenda Makumbe", nickname: "Noku", position: "Defender", number: 4, goals: 1, assists: 2, playerImage: "images/noku.jpg" },
    { id: 19, name: "Saul Garira", nickname: "Sauro", position: "Defender", number: 3, goals: 0, assists: 1, playerImage: "images/sauro.jpg" },
    { id: 20, name: "Alban Makwarimba", nickname: "Bhani", position: "Defender", number: 16, goals: 1, assists: 2, playerImage: "images/ban.jpg" },
    { id: 21, name: "Musa Chasepa", nickname: "Inter", position: "Defender", number: 2, goals: 0, assists: 0, playerImage: "images/inter.jpg" },
    { id: 22, name: "Washington Murambidza", nickname: "Washco", position: "Defender", number: 22, goals: 0, assists: 0, playerImage: "images/washco.jpg" },
    { id: 23, name: "Ian Pisirai", nickname: "Ian", position: "Defender", number: 20, goals: 23, assists: 0, playerImage: "images/ian.jpg" },
    { id: 24, name: "Leeroy Mamombe", nickname: "Maleedza", position: "Defender", number: 24, goals: 0, assists: 0, playerImage: "images/maleedza.jpg" },
    { id :25, name:"Bruce Tanaka Venganai" , nickname:"Tanaka" , position:"Defender" , number :21 , goals :0 , assists :0 , playerImage:"images/bruce.jpg"},

    // Goalkeepers
    { id: 26, name: "Knowledge Sheche", nickname: "Ba Rashy", position: "Goalkeeper", number: 1, cleansheets: 20, SavePercentage: 60, playerImage: "images/rashy1.jpg" },
    { id: 27, name: "Robert Marongwe", nickname: "Robho", position: "Goalkeeper", number: 23, cleansheets: 2, SavePercentage: 20, playerImage: "images/robho.jpg" },
    

];

let allPlayers = [];

// Load players from both base data and admin panel
function loadAllPlayers() {
    // Start with base players
    allPlayers = [...basePlayers];

    // Load admin players from localStorage
    const adminPlayersData = localStorage.getItem('adminPlayers');
    if (adminPlayersData) {
        const adminPlayers = JSON.parse(adminPlayersData);
        // Mark admin players as new signings and add them
        const adminPlayersWithFlag = adminPlayers.map(player => ({
            ...player,
            isNewSigning: true
        }));
        allPlayers = [...allPlayers, ...adminPlayersWithFlag];
    }

    // Update hero stats
    updateHeroStats();
}

function updateHeroStats() {
    const totalPlayersElement = document.getElementById('totalPlayers');
    if (totalPlayersElement) {
        totalPlayersElement.textContent = allPlayers.length;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rosterContainer = document.getElementById('rosterPlayers');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Load all players (base + admin)
    loadAllPlayers();

    // Store players in localStorage for player-detail page
    localStorage.setItem('allPlayers', JSON.stringify(allPlayers));

    displayPlayers(allPlayers, rosterContainer);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const position = button.getAttribute('data-position');
            const filtered = position === 'all'
                ? allPlayers
                : allPlayers.filter(player => player.position === position);

            displayPlayers(filtered, rosterContainer);
        });
    });
});

function displayPlayers(players, container) {
    container.innerHTML = '';
    players.forEach(player => {
        const playerCube = createPlayerCube(player);
        container.appendChild(playerCube);
    });
}

function createPlayerCube(player) {
    const cubeWrapper = document.createElement('div');
    cubeWrapper.className = 'player-cube-wrapper';
    cubeWrapper.style.cursor = 'pointer';
    cubeWrapper.onclick = () => {
        // Store selected player and navigate
        localStorage.setItem('selectedPlayer', JSON.stringify(player));
        window.location.href = `player-detail.html?id=${player.id}`;
    };

    const cube = document.createElement('div');
    cube.className = 'player-cube';

    // Front face - Name
    const frontFace = document.createElement('div');
    frontFace.className = 'cube-face front-face';
    frontFace.innerHTML = `
        <div class="cube-face-content">
            <img src="${player.playerImage}" alt="${player.name}" class="player-passport-photo">
            <h3>${player.name}</h3>
            <p class="jersey">#${player.number}</p>
            ${player.isNewSigning ? '<div class="new-signing-badge">⭐ NEW SIGNING</div>' : ''}
        </div>
    `;

    // Right face - Nickname
    const rightFace = document.createElement('div');
    rightFace.className = 'cube-face right-face';
    rightFace.innerHTML = `
        <div class="cube-face-content">
            <h4>Nickname</h4>
            <p class="nickname-text">"${player.nickname}"</p>
        </div>
    `;

    // Back face - Career Stats (different based on position)
    const backFace = document.createElement('div');
    backFace.className = 'cube-face back-face';

    let statsHTML = '<div class="cube-face-content"><h4>Career Stats</h4>';

    if (player.position === 'Goalkeeper') {
        statsHTML += `
            <div class="stat-item">
                <span class="stat-label">Save %</span>
                <span class="stat-value">${player.SavePercentage || player.savePercentage || 0}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Clean Sheets</span>
                <span class="stat-value">${player.cleansheets || 0}</span>
            </div>
        `;
    } else if (player.position === 'Defender') {
        statsHTML += `
            <div class="stat-item">
                <span class="stat-label">Goals</span>
                <span class="stat-value">${player.goals || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Assists</span>
                <span class="stat-value">${player.assists || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Clean Sheets</span>
                <span class="stat-value">${player.cleansheets || 0}</span>
            </div>
        `;
    } else {
        // Forwards and Midfielders
        statsHTML += `
            <div class="stat-item">
                <span class="stat-label">Goals</span>
                <span class="stat-value">${player.goals || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Assists</span>
                <span class="stat-value">${player.assists || 0}</span>
            </div>
        `;
    }

    statsHTML += '</div>';
    backFace.innerHTML = statsHTML;

    // Left face - Position
    const leftFace = document.createElement('div');
    leftFace.className = 'cube-face left-face';
    leftFace.innerHTML = `
        <div class="cube-face-content">
            <h4>Position</h4>
            <p class="position-text">${player.position}</p>
            <div class="position-badge">${player.position.charAt(0)}</div>
        </div>
    `;

    cube.appendChild(frontFace);
    cube.appendChild(rightFace);
    cube.appendChild(backFace);
    cube.appendChild(leftFace);

    cubeWrapper.appendChild(cube);
    return cubeWrapper;
}
