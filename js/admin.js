document.addEventListener("DOMContentLoaded", init);

/* ================= GLOBAL STATE ================= */
let players = [];
let matches = [];
let currentEvents = [];

/* ================= INIT ================= */
function init(){
    checkAuth();
    loadData();
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
                events: currentEvents
            };
            updateStats(match.events);
            const idx = matches.findIndex(m=>m.id==match.id);
            if(idx>-1) matches[idx]=match; else matches.push(match);
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
        <div class="card"><strong>${p.name}</strong><br>⚽ ${p.goals} | 🎯 ${p.assists}</div>
    `).join("");
}

/* ================= PLAYER DROPDOWN ================= */
function populatePlayerDropdown(){
    const select = document.getElementById("eventPlayer");
    if(!select) return;
    const options = [`<option value="">Select player</option>`].concat(
        players.map(p=>`<option value="${p.name}">${p.name}</option>`)
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
        <div class="card"><strong>${m.homeTeam} vs ${m.awayTeam}</strong><br>
        ${m.status==="completed"?`${m.homeScore} - ${m.awayScore}`:"Upcoming"}</div>
    `).join("");
}

/* ================= RENDER ALL ================= */
function renderAll(){ renderPlayers(); renderMatches(); }