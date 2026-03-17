/* ================= STORAGE ================= */

let players = JSON.parse(localStorage.getItem("adminPlayers")) || [];
let matches = JSON.parse(localStorage.getItem("adminMatches")) || [];

/* ================= DASHBOARD ================= */

function updateDashboard() {
    document.getElementById("totalPlayers").textContent = players.length;
    document.getElementById("totalMatches").textContent = matches.length;
    document.getElementById("upcomingMatches").textContent =
        matches.filter(m => m.status === "upcoming").length;
}

/* ================= PLAYERS ================= */

const playerForm = document.getElementById("playerForm");

playerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("playerId").value || Date.now();

    const player = {
        id: Number(id),
        name: playerForm.playerName.value,
        nickname: playerForm.playerNickname.value,
        position: playerForm.playerPosition.value,
        number: playerForm.playerNumber.value,
        goals: Number(playerForm.playerGoals.value) || 0,
        assists: Number(playerForm.playerAssists.value) || 0,
        image: playerForm.playerImage.value
    };

    players = players.filter(p => p.id !== player.id);
    players.push(player);

    localStorage.setItem("adminPlayers", JSON.stringify(players));

    playerForm.reset();
    displayPlayers();
    updateDashboard();
});

/* ================= MATCHES ================= */

const matchForm = document.getElementById("matchForm");

matchForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("matchId").value || Date.now();

    const existing = matches.find(m => m.id == id);

    const match = {
        id: Number(id),
        homeTeam: matchForm.homeTeam.value,
        awayTeam: matchForm.awayTeam.value,
        date: matchForm.matchDate.value,
        time: matchForm.matchTime.value,
        venue: matchForm.matchVenue.value,
        status: matchForm.matchStatus.value,
        homeScore: Number(matchForm.homeScore.value) || 0,
        awayScore: Number(matchForm.awayScore.value) || 0,
        events: existing ? existing.events : []
    };

    matches = matches.filter(m => m.id !== match.id);
    matches.push(match);

    localStorage.setItem("adminMatches", JSON.stringify(matches));

    matchForm.reset();
    displayMatches();
    populateMatchDropdown();
    updateDashboard();
});

/* ================= EVENTS ================= */

const eventType = document.getElementById("eventType");
const playerOffInput = document.getElementById("eventPlayerOff");

eventType.addEventListener("change", function() {
    playerOffInput.style.display =
        eventType.value === "sub" ? "block" : "none";
});

function addEvent() {

    const matchId = Number(document.getElementById("eventMatchSelect").value);
    const type = eventType.value;
    const player = document.getElementById("eventPlayer").value;
    const minute = Number(document.getElementById("eventMinute").value);
    const playerOff = playerOffInput.value;

    if (!player || !minute) {
        alert("Please enter player and minute");
        return;
    }

    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    let event = { type, player, minute };

    // Auto score update
    if (type === "goal") {
        if (match.homeTeam === "Tango Forces") {
            match.homeScore++;
        }
    }

    if (type === "sub") {
        event.player_out = playerOff;
    }

    match.events.push(event);

    // Sort by minute
    match.events.sort((a, b) => a.minute - b.minute);

    localStorage.setItem("adminMatches", JSON.stringify(matches));

    displayEvents(matchId);
    displayMatches();
}

/* ================= DISPLAY FUNCTIONS ================= */

function displayPlayers() {
    const list = document.getElementById("playersList");
    list.innerHTML = "";

    players.forEach(p => {
        list.innerHTML += `
        <div>
            <strong>${p.name}</strong> (#${p.number}) - ${p.position}
        </div>`;
    });
}

function displayMatches() {
    const list = document.getElementById("matchesList");
    list.innerHTML = "";

    matches.forEach(m => {
        list.innerHTML += `
        <div>
            <strong>${m.homeTeam} vs ${m.awayTeam}</strong><br>
            ${m.status === "completed"
                ? `${m.homeScore} - ${m.awayScore}`
                : "Upcoming"}
            <br>
            <button onclick="displayEvents(${m.id})">View Events</button>
        </div>`;
    });
}

function populateMatchDropdown() {
    const select = document.getElementById("eventMatchSelect");
    select.innerHTML = "";

    matches.forEach(m => {
        select.innerHTML += `
        <option value="${m.id}">
            ${m.homeTeam} vs ${m.awayTeam}
        </option>`;
    });
}

function displayEvents(matchId) {

    const container = document.getElementById("eventsList");
    container.innerHTML = "";

    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    match.events.forEach(e => {

        let text = "";

        if (e.type === "goal")
            text = `⚽ ${e.player} (${e.minute}')`;

        if (e.type === "yellow")
            text = `🟨 ${e.player} (${e.minute}')`;

        if (e.type === "red")
            text = `🟥 ${e.player} (${e.minute}')`;

        if (e.type === "sub")
            text = `🔁 ${e.player} ↔ ${e.player_out} (${e.minute}')`;

        container.innerHTML += `<div>${text}</div>`;
    });
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", function() {
    displayPlayers();
    displayMatches();
    populateMatchDropdown();
    updateDashboard();
});
