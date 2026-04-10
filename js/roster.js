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
    { id: 10, name: "Milton Bosha", nickname: "Milito", position: "Midfielder", number: 4, goals: 10, assists: 16, playerImage: "images/milito1.jpg" },
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
    { id: 25, name: "Bruce Tanaka Venganai", nickname: "Tanaka", position: "Defender", number: 21, goals: 0, assists: 0, playerImage: "images/bruce.jpg" },

    // Goalkeepers
    { id: 26, name: "Knowledge Sheche", nickname: "Ba Rashy", position: "Goalkeeper", number: 1, cleansheets: 20, SavePercentage: 60, playerImage: "images/rashy1.jpg" },
    { id: 27, name: "Robert Marongwe", nickname: "Robho", position: "Goalkeeper", number: 23, cleansheets: 2, SavePercentage: 20, playerImage: "images/robho.jpg" },
];

let allPlayers = [];

/* ================= LOAD PLAYERS ================= */
function loadAllPlayers() {

    // Base players
    allPlayers = [...basePlayers];

    // Admin players
    const adminPlayersData = localStorage.getItem('adminPlayers');

    if (adminPlayersData) {
        const adminPlayers = JSON.parse(adminPlayersData);

        const adminPlayersWithFlag = adminPlayers.map(player => ({
            ...player,
            isNewSigning: true
        }));

        allPlayers = [...allPlayers, ...adminPlayersWithFlag];
    }

    // ✅ CRITICAL: MAKE AVAILABLE TO MATCHES PAGE
    localStorage.setItem('allPlayers', JSON.stringify(allPlayers));

    updateHeroStats();
}

/* ================= HERO STATS ================= */
function updateHeroStats() {
    const totalPlayersElement = document.getElementById('totalPlayers');
    if (totalPlayersElement) {
        totalPlayersElement.textContent = allPlayers.length;
    }
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {

    const rosterContainer = document.getElementById('rosterPlayers');
    const filterButtons = document.querySelectorAll('.filter-btn');

    loadAllPlayers();

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

/* ================= DISPLAY ================= */
function sortPlayersByPosition(players) {
    const order = { Forward: 1, Midfielder: 2, Defender: 3, Goalkeeper: 4 };
    return [...players].sort((a, b) => {
        const positionA = order[a.position] || 5;
        const positionB = order[b.position] || 5;
        if (positionA !== positionB) return positionA - positionB;
        return (a.name || '').localeCompare(b.name || '');
    });
}

function displayPlayers(players, container) {
    container.innerHTML = '';
    const sorted = sortPlayersByPosition(players);
    sorted.forEach(player => {
        const cube = createPlayerCube(player);
        container.appendChild(cube);
    });
}

/* ================= PLAYER CARD ================= */
function createPlayerCube(player) {

    const wrapper = document.createElement('div');
    wrapper.className = 'player-cube-wrapper';
    wrapper.style.cursor = 'pointer';

    wrapper.onclick = () => {
        localStorage.setItem('selectedPlayer', JSON.stringify(player));
        window.location.href = `player-detail.html?id=${player.id}`;
    };

    const cube = document.createElement('div');
    cube.className = 'player-cube';

    /* FRONT */
    const front = document.createElement('div');
    front.className = 'cube-face front-face';
    front.innerHTML = `
        <div class="cube-face-content">
            <img src="${player.playerImage}" class="player-passport-photo">
            <h3>${player.name}</h3>
            <p>#${player.number}</p>
            ${player.isNewSigning ? '<div class="new-signing-badge">⭐ NEW</div>' : ''}
        </div>
    `;

    /* RIGHT */
    const right = document.createElement('div');
    right.className = 'cube-face right-face';
    right.innerHTML = `
        <div class="cube-face-content">
            <h4>Nickname</h4>
            <p>"${player.nickname}"</p>
        </div>
    `;

    /* BACK */
    const back = document.createElement('div');
    back.className = 'cube-face back-face';

    let stats = `<div class="cube-face-content"><h4>Stats</h4>`;

    if (player.position === 'Goalkeeper') {
        stats += `
            <p>Save %: ${player.SavePercentage || 0}%</p>
            <p>Clean Sheets: ${player.cleansheets || 0}</p>
        `;
    } else {
        stats += `
            <p>Goals: ${player.goals || 0}</p>
            <p>Assists: ${player.assists || 0}</p>
        `;
    }

    stats += `</div>`;
    back.innerHTML = stats;

    /* LEFT */
    const left = document.createElement('div');
    left.className = 'cube-face left-face';
    left.innerHTML = `
        <div class="cube-face-content">
            <h4>${player.position}</h4>
        </div>
    `;

    cube.appendChild(front);
    cube.appendChild(right);
    cube.appendChild(back);
    cube.appendChild(left);

    wrapper.appendChild(cube);

    return wrapper;
}