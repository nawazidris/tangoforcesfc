document.addEventListener("DOMContentLoaded", init);

/* ================= GLOBAL STATE ================= */
let players = [];
let matches = [];
let currentEvents = [];
let rosterPlayers = [];

/* ================= INIT ================= */
async function init(){
    checkAuth();
    loadData();
    await loadRosterPlayers();
    bindForms();
    renderAll();
    populatePlayerDropdown();
}

/* ================= AUTH ================= */
function checkAuth(){
    if(sessionStorage.getItem("adminToken") !== "tango_secure_admin"){
        window.location.href = "tango-admin-access.html";
    }
}

function logout(){
    sessionStorage.clear();
    window.location.href = "tango-admin-access.html";
}
window.logout = logout;

/* ================= DATA ================= */
function loadData(){
    players = JSON.parse(localStorage.getItem("adminPlayers")) || [];
    matches = JSON.parse(localStorage.getItem("adminMatches")) || [];
}
function savePlayers(){localStorage.setItem("adminPlayers", JSON.stringify(players));}
function saveMatches(){localStorage.setItem("adminMatches", JSON.stringify(matches));}

async function loadRosterPlayers(){
    const stored = localStorage.getItem('allPlayers');
    if(stored){
        rosterPlayers = JSON.parse(stored).map(p => ({ id: p.id, name: p.name }));
    }

    if(rosterPlayers.length === 0){
        try {
            const response = await fetch('data/players.json');
            const json = await response.json();
            rosterPlayers = json.map(p => ({ id: p.id, name: p.name }));
        } catch (error) {
            console.warn('Could not load roster players from data/players.json', error);
            rosterPlayers = [];
        }
    }

    const adminStored = JSON.parse(localStorage.getItem('adminPlayers') || '[]');
    adminStored.forEach(p => {
        if(!rosterPlayers.some(r => r.name === p.name)){
            rosterPlayers.push({ id: p.id, name: p.name });
        }
    });
}

function addOrUpdateRosterPlayer(player){
    const idx = rosterPlayers.findIndex(r => r.id===player.id || r.name===player.name);
    if(idx > -1){
        rosterPlayers[idx] = { id: player.id, name: player.name };
    } else {
        rosterPlayers.push({ id: player.id, name: player.name });
    }
}

/* ================= FORM BINDINGS ================= */
function bindForms(){
    const playerForm = document.getElementById("playerForm");
    const matchForm = document.getElementById("matchForm");

    if(playerForm){
        playerForm.addEventListener("submit", function(e){
            e.preventDefault();
            const id = document.getElementById("playerId").value || Date.now();
            const player = {
                id: Number(id),
                name: document.getElementById("playerName").value,
                goals: Number(document.getElementById("playerGoals").value)||0,
                assists: Number(document.getElementById("playerAssists").value)||0
            };
            const idx = players.findIndex(p=>p.id===player.id);
            if(idx>-1) players[idx]=player; else players.push(player);
            savePlayers();
            addOrUpdateRosterPlayer(player);
            playerForm.reset();
            document.getElementById("playerId").value="";
            renderPlayers();
            populatePlayerDropdown();
        });
    }

    if(matchForm){
        matchForm.addEventListener("submit", function(e){
            e.preventDefault();
            const match = {
                id: document.getElementById("matchId").value || Date.now(),
                homeTeam: document.getElementById("homeTeam").value,
                awayTeam: document.getElementById("awayTeam").value,
                date: document.getElementById("matchDate").value,
                time: document.getElementById("matchTime").value,
                venue: document.getElementById("matchVenue").value,
                status: document.getElementById("matchStatus").value,
                homeScore: document.getElementById("homeScore").value,
                awayScore: document.getElementById("awayScore").value,
                events: [...currentEvents]
            };

            if(match.status === 'completed' && (match.homeScore === '' || match.awayScore === '')){
                alert('Add both home and away scores before saving a completed match.');
                return;
            }

            const idx = matches.findIndex(m=>m.id==match.id);
            if(idx>-1){
                revertStats(matches[idx]);
                matches[idx] = match;
            } else {
                matches.push(match);
            }

            if(match.status === 'completed'){
                updateStats(match.events);
            }

            saveMatches();
            matchForm.reset();
            currentEvents=[];
            renderEventList();
            renderMatches();
        });
    }
}

/* ================= PLAYERS ================= */
function renderPlayers(){
    const container = document.getElementById("playersList");
    if(!container) return;
    if(players.length === 0){
        container.innerHTML = "<p>No players added yet.</p>";
        return;
    }
    container.innerHTML = players.map(p=>`
        <div class="card">
            <strong>${p.name}</strong><br>⚽ ${p.goals} | 🎯 ${p.assists}
            <button type="button" class="small-btn" onclick="editPlayer(${p.id})">Edit</button>
        </div>
    `).join("");
}

/* ================= PLAYER DROPDOWN ================= */
function populatePlayerDropdown(){
    const select = document.getElementById("eventPlayer");
    if(!select) return;
    const source = rosterPlayers.length ? rosterPlayers : players;
    const options = [`<option value="">Select player</option>`].concat(
        source.map(p=>`<option value="${p.name}">${p.name}</option>`)
    );
    select.innerHTML = options.join("");
}

/* ================= EVENTS ================= */
function addEvent(){
    const player = document.getElementById("eventPlayer").value;
    const type = document.getElementById("eventType").value;
    const team = document.getElementById("eventTeam").value;
    const minute = document.getElementById("eventMinute").value;

    if(!player){ alert("Select a player"); return; }

    currentEvents.push({type, team, player, minute});
    renderEventList();
}
window.addEvent = addEvent;

function renderEventList(){
    const container = document.getElementById("eventList");
    if(!container) return;
    if(currentEvents.length===0){ container.innerHTML="<p>No events added</p>"; return; }
    container.innerHTML=currentEvents.map((e,i)=>`
        <div class="event">${e.minute?"'"+e.minute+"'":""} ${e.player} (${e.type}) 
        <button onclick="removeEvent(${i})">❌</button></div>
    `).join("");
}
function removeEvent(idx){ currentEvents.splice(idx,1); renderEventList(); }
window.removeEvent = removeEvent;

/* ================= UPDATE PLAYER STATS ================= */
function updateStats(events){
    events.forEach(e=>{
        const p = players.find(x=>x.name===e.player);
        if(!p) return;
        if(e.type==="goal") p.goals++;
        if(e.type==="assist") p.assists++;
    });
    savePlayers();
}

/* ================= MATCHES ================= */
function renderMatches(){
    const container = document.getElementById("matchesList");
    if(!container) return;
    if(matches.length === 0){
        container.innerHTML = "<p>No matches added yet.</p>";
        return;
    }
    container.innerHTML = matches.map(m=>`
        <div class="card">
            <strong>${m.homeTeam} vs ${m.awayTeam}</strong><br>
            <span>Status: ${m.status}</span><br>
            ${m.status==="completed"?`${m.homeScore} - ${m.awayScore}`:"Upcoming"}
            <button type="button" class="small-btn" onclick="editMatch(${m.id})">Edit</button>
        </div>
    `).join("");
}

function revertStats(match){
    if(!match || !match.events) return;
    match.events.forEach(e=>{
        const p = players.find(x=>x.name===e.player);
        if(!p) return;
        if(e.type === "goal") p.goals = Math.max(0, p.goals - 1);
        if(e.type === "assist") p.assists = Math.max(0, p.assists - 1);
    });
    savePlayers();
}

function editPlayer(id){
    const player = players.find(p=>p.id===id);
    if(!player) return;
    document.getElementById("playerId").value = player.id;
    document.getElementById("playerName").value = player.name;
    document.getElementById("playerGoals").value = player.goals;
    document.getElementById("playerAssists").value = player.assists;
}

function editMatch(id){
    const match = matches.find(m=>m.id==id);
    if(!match) return;
    document.getElementById("matchId").value = match.id;
    document.getElementById("homeTeam").value = match.homeTeam;
    document.getElementById("awayTeam").value = match.awayTeam;
    document.getElementById("matchDate").value = match.date;
    document.getElementById("matchTime").value = match.time;
    document.getElementById("matchVenue").value = match.venue;
    document.getElementById("matchStatus").value = match.status;
    document.getElementById("homeScore").value = match.homeScore || "";
    document.getElementById("awayScore").value = match.awayScore || "";
    currentEvents = match.events ? [...match.events] : [];
    renderEventList();
}

window.editPlayer = editPlayer;
window.editMatch = editMatch;

/* ================= RENDER ALL ================= */
function renderAll(){ renderPlayers(); renderMatches(); }