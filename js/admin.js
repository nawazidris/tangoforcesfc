"use strict";

/* ==============================
   ADMIN PANEL SCRIPT (FIXED)
================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("ADMIN JS LOADED");

    /* ================= STORAGE ================= */

    let players = JSON.parse(localStorage.getItem("adminPlayers")) || [];
    let matches = JSON.parse(localStorage.getItem("adminMatches")) || [];

    /* ================= ELEMENTS ================= */

    const playerForm = document.getElementById("playerForm");
    const matchForm = document.getElementById("matchForm");
    const eventType = document.getElementById("eventType");
    const playerOffInput = document.getElementById("eventPlayerOff");

    /* ================= DASHBOARD ================= */

    function updateDashboard() {
        const totalPlayers = document.getElementById("totalPlayers");
        const totalMatches = document.getElementById("totalMatches");
        const upcomingMatches = document.getElementById("upcomingMatches");

        if (totalPlayers) totalPlayers.textContent = players.length;
        if (totalMatches) totalMatches.textContent = matches.length;
        if (upcomingMatches)
            upcomingMatches.textContent =
                matches.filter(m => m.status === "upcoming").length;
    }

    /* ================= PLAYERS ================= */

    if (playerForm) {
        playerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const id =
                document.getElementById("playerId").value || Date.now();

            const player = {
                id: Number(id),
                name: document.getElementById("playerName").value,
                nickname: document.getElementById("playerNickname").value,
                position: document.getElementById("playerPosition").value,
                number: document.getElementById("playerNumber").value,
                goals: Number(document.getElementById("playerGoals").value) || 0,
                assists: Number(document.getElementById("playerAssists").value) || 0,
                image: document.getElementById("playerImage").value
            };

            players = players.filter(p => p.id !== player.id);
            players.push(player);

            localStorage.setItem("adminPlayers", JSON.stringify(players));

            playerForm.reset();
            displayPlayers();
            updateDashboard();
        });
    }

    function displayPlayers() {
        const list = document.getElementById("playersList");
        if (!list) return;

        list.innerHTML = "";

        players.forEach(p => {
            list.innerHTML += `
                <div>
                    <strong>${p.name}</strong>
                    (#${p.number || "-"}) - ${p.position}
                </div>
            `;
        });
    }

    /* ================= MATCHES ================= */

    if (matchForm) {
        matchForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const id =
                document.getElementById("matchId").value || Date.now();

            const existing = matches.find(m => m.id == id);

            const match = {
                id: Number(id),
                homeTeam: document.getElementById("homeTeam").value,
                awayTeam: document.getElementById("awayTeam").value,
                date: document.getElementById("matchDate").value,
                time: document.getElementById("matchTime").value,
                venue: document.getElementById("matchVenue").value,
                status: document.getElementById("matchStatus").value,
                homeScore:
                    Number(document.getElementById("homeScore").value) || 0,
                awayScore:
                    Number(document.getElementById("awayScore").value) || 0,
                events: existing ? existing.events : []
            };

            matches = matches.filter(m => m.id !== match.id);
            matches.push(match);

            localStorage.setItem(
                "adminMatches",
                JSON.stringify(matches)
            );

            matchForm.reset();
            displayMatches();
            populateMatchDropdown();
            updateDashboard();
        });
    }

    function displayMatches() {
        const list = document.getElementById("matchesList");
        if (!list) return;

        list.innerHTML = "";

        matches.forEach(m => {
            list.innerHTML += `
                <div>
                    <strong>${m.homeTeam} vs ${m.awayTeam}</strong><br>
                    ${
                        m.status === "completed"
                            ? `${m.homeScore} - ${m.awayScore}`
                            : "Upcoming"
                    }
                    <br>
                    <button onclick="displayEvents(${m.id})">
                        View Events
                    </button>
                </div>
            `;
        });
    }

    function populateMatchDropdown() {
        const select = document.getElementById("eventMatchSelect");
        if (!select) return;

        select.innerHTML = "";

        matches.forEach(m => {
            select.innerHTML += `
                <option value="${m.id}">
                    ${m.homeTeam} vs ${m.awayTeam}
                </option>
            `;
        });
    }

    /* ================= EVENTS ================= */

    if (eventType) {
        eventType.addEventListener("change", function () {
            if (playerOffInput)
                playerOffInput.style.display =
                    eventType.value === "sub"
                        ? "block"
                        : "none";
        });
    }

    window.addEvent = function () {
        const matchId = Number(
            document.getElementById("eventMatchSelect").value
        );

        const type = document.getElementById("eventType").value;
        const player = document.getElementById("eventPlayer").value;
        const minute = Number(
            document.getElementById("eventMinute").value
        );
        const playerOff = playerOffInput?.value;

        if (!player || !minute) {
            alert("Please enter player and minute");
            return;
        }

        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        let event = { type, player, minute };

        if (type === "goal") {
            match.homeScore++;
        }

        if (type === "sub") {
            event.player_out = playerOff;
        }

        match.events.push(event);

        match.events.sort((a, b) => a.minute - b.minute);

        localStorage.setItem(
            "adminMatches",
            JSON.stringify(matches)
        );

        displayEvents(matchId);
        displayMatches();
    };

    window.displayEvents = function (matchId) {
        const container =
            document.getElementById("eventsList");

        if (!container) return;

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
                text = `🔁 ${e.player} ↔ ${e.player_out}
                (${e.minute}')`;

            container.innerHTML += `<div>${text}</div>`;
        });
    };

    /* ================= LOGOUT ================= */

    window.logout = function () {
        localStorage.clear();
        window.location.href = "index.html";
    };

    /* ================= INIT ================= */

    displayPlayers();
    displayMatches();
    populateMatchDropdown();
    updateDashboard();

});
