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
    toggleAssistField();
    loadAdminStandings();
}

/* ================= AUTH ================= */
function checkAuth(){
    if(sessionStorage.getItem("adminToken") !== "tango_secure_admin"){
        window.location.href = "login.html";
    }
}

function logout(){
    sessionStorage.clear();
    window.location.href = "login.html";
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
                nickname: document.getElementById("playerNickname").value || '',
                position: document.getElementById("playerPosition").value || 'Forward',
                number: Number(document.getElementById("playerNumber").value) || null,
                playerImage: document.getElementById("playerImage").value || 'images/idris.jpg',
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

    const standingsInput = document.getElementById("standingsFileInput");
    if (standingsInput) {
        standingsInput.addEventListener("change", handleStandingsUpload);
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
            <strong>${p.name}</strong> <span style="color:#005cb8;">(${p.position || 'Forward'})</span><br>
            #${p.number || 'N/A'} | ⚽ ${p.goals} | 🎯 ${p.assists}<br>
            <small>${p.nickname || ''}</small>
            <button type="button" class="small-btn" onclick="editPlayer(${p.id})">Edit</button>
        </div>
    `).join("");
}

/* ================= PLAYER DROPDOWN ================= */
function populatePlayerDropdown(){
    const playerSelect = document.getElementById("eventPlayer");
    const assistSelect = document.getElementById("eventAssist");
    if(!playerSelect) return;
    const source = rosterPlayers.length ? rosterPlayers : players;
    const options = [`<option value="">Select player</option>`].concat(
        source.map(p=>`<option value="${p.name}">${p.name}</option>`)
    );
    playerSelect.innerHTML = options.join("");
    if(assistSelect){
        assistSelect.innerHTML = [`<option value="">Assist (optional)</option>`].concat(
            source.map(p=>`<option value="${p.name}">${p.name}</option>`)
        ).join("");
    }
}

function toggleAssistField(){
    const type = document.getElementById("eventType").value;
    const assistSelect = document.getElementById("eventAssist");
    if(!assistSelect) return;
    assistSelect.style.display = type === 'goal' ? 'block' : 'none';
}

/* ================= EVENTS ================= */
function addEvent(){
    const player = document.getElementById("eventPlayer").value;
    const type = document.getElementById("eventType").value;
    const assist = document.getElementById("eventAssist")?.value || '';
    const team = document.getElementById("eventTeam").value;
    const minute = document.getElementById("eventMinute").value;

    if(!player){ alert("Select a player"); return; }
    if(type === 'goal' && assist && assist === player){
        alert('Assist cannot be the same player as the goal scorer.');
        return;
    }

    const event = {type, team, player, minute};
    if(type === 'goal' && assist){
        event.assist = assist;
    }

    currentEvents.push(event);
    renderEventList();
}
window.addEvent = addEvent;

function renderEventList(){
    const container = document.getElementById("eventList");
    if(!container) return;
    if(currentEvents.length===0){ container.innerHTML="<p>No events added</p>"; return; }
    container.innerHTML=currentEvents.map((e,i)=>{
        let details = `${e.player} (${e.type})`;
        if(e.type === 'goal' && e.assist){
            details = `${e.player} (goal, assist: ${e.assist})`;
        } else if(e.type === 'assist'){
            details = `${e.player} (assist)`;
        }
        return `
        <div class="event">${e.minute?"'"+e.minute+"'":""} ${details} 
        <button onclick="removeEvent(${i})">❌</button></div>`;
    }).join("");
}
function removeEvent(idx){ currentEvents.splice(idx,1); renderEventList(); }
window.removeEvent = removeEvent;

function handleStandingsUpload(event){
    const file = event.target.files?.[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
        const text = reader.result;
        let parsed = null;

        if (file.type.includes('json') || file.name.toLowerCase().endsWith('.json')) {
            try {
                parsed = JSON.parse(text);
            } catch (error) {
                parsed = null;
            }
        } else {
            parsed = parseStandingText(text);
        }

        if (parsed && parsed.headers && parsed.rows) {
            localStorage.setItem('leagueStandingsJson', JSON.stringify(parsed));
            renderStandingsPreview(parsed);
            await saveUpdatedLogJson(parsed);
            alert('Standings uploaded and saved for the public page. A log.json save was attempted.');
        } else {
            alert('Unable to parse the standings log. Please use a plain table or JSON format.');
        }
    };
    reader.readAsText(file);
}

async function saveUpdatedLogJson(parsed) {
    const content = JSON.stringify(parsed, null, 2);

    if (window.showSaveFilePicker) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'log.json',
                types: [{
                    description: 'JSON file',
                    accept: { 'application/json': ['.json'] }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            return;
        } catch (error) {
            console.warn('Save file picker cancelled or unavailable:', error);
        }
    }

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'log.json';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function parseStandingText(text){
    if(!text || typeof text !== 'string') return null;
    const lines = text.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if(lines.length < 2) return null;

    const headers = lines[0].match(/\S+/g) || [];
    if(headers.length < 3) return null;

    const rows = lines.slice(1).map(line => {
        const tokens = line.match(/\S+/g) || [];
        if(tokens.length === headers.length) {
            return tokens;
        }

        if(tokens.length >= headers.length + 1) {
            const position = tokens[0];
            const stats = tokens.slice(-8);
            const teamName = tokens.slice(1, tokens.length - 8).join(' ');
            return [position, teamName, ...stats];
        }

        return null;
    }).filter(row => row && row.length === headers.length);

    return rows.length ? { headers, rows } : null;
}

function renderStandingsPreview(parsed){
    const preview = document.getElementById('standingsAdminPreview');
    if(!preview) return;
    preview.innerHTML = '';
    if(!parsed || !parsed.headers || !parsed.rows || parsed.rows.length === 0){
        preview.innerHTML = '<p>No standings could be rendered.</p>';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    parsed.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    parsed.rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    preview.appendChild(table);
}

function loadAdminStandings(){
    const stored = localStorage.getItem('leagueStandingsJson');
    if (!stored) return;
    try {
        const parsed = JSON.parse(stored);
        renderStandingsPreview(parsed);
    } catch (error) {
        console.warn('Could not load stored standings preview.', error);
    }
}

/* ================= UPDATE PLAYER STATS ================= */
function updateStats(events){
    events.forEach(e=>{
        const scorer = players.find(x=>x.name===e.player);
        if(e.type==="goal" && scorer){
            scorer.goals++;
            if(e.assist){
                const assister = players.find(x=>x.name===e.assist);
                if(assister) assister.assists++;
            }
        }
        if(e.type==="assist"){
            const assistant = players.find(x=>x.name===e.player);
            if(assistant) assistant.assists++;
        }
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
        if(e.type === "goal" && p){
            p.goals = Math.max(0, p.goals - 1);
            if(e.assist){
                const assister = players.find(x=>x.name===e.assist);
                if(assister) assister.assists = Math.max(0, assister.assists - 1);
            }
        }
        if(e.type === "assist" && p){
            p.assists = Math.max(0, p.assists - 1);
        }
    });
    savePlayers();
}

function editPlayer(id){
    const player = players.find(p=>p.id===id);
    if(!player) return;
    document.getElementById("playerId").value = player.id;
    document.getElementById("playerName").value = player.name;
    document.getElementById("playerNickname").value = player.nickname || '';
    document.getElementById("playerPosition").value = player.position || 'Forward';
    document.getElementById("playerNumber").value = player.number || '';
    document.getElementById("playerImage").value = player.playerImage || '';
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