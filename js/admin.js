/* ================= SECURITY ================= */

const token = sessionStorage.getItem("adminToken");
const expiry = sessionStorage.getItem("adminExpiry");

if(!token || !expiry){
window.location.href="tango-admin-access.html";
}

if(Date.now() > Number(expiry)){
alert("Session expired");
sessionStorage.clear();
window.location.href="tango-admin-access.html";
}

function logout(){
sessionStorage.clear();
window.location.href="tango-admin-access.html";
}

/* ================= TABS ================= */

document.addEventListener("DOMContentLoaded", function(){

const buttons = document.querySelectorAll(".admin-tab-btn");
const tabs = document.querySelectorAll(".admin-tab");

buttons.forEach(btn=>{
btn.addEventListener("click",function(){

buttons.forEach(b=>b.classList.remove("active"));
tabs.forEach(t=>t.classList.remove("active"));

this.classList.add("active");
document.getElementById(this.dataset.tab+"-tab").classList.add("active");

});
});

});

/* ================= DATA ================= */

let players = JSON.parse(localStorage.getItem("adminPlayers")) || [];
let matches = JSON.parse(localStorage.getItem("adminMatches")) || [];

/* ================= PLAYERS ================= */

const playerForm = document.getElementById("playerForm");

playerForm.addEventListener("submit",function(e){
e.preventDefault();

const id = document.getElementById("playerId").value || Date.now();

const player = {
id:Number(id),
name:playerForm.playerName.value,
nickname:playerForm.playerNickname.value,
position:playerForm.playerPosition.value,
number:playerForm.playerNumber.value,
goals:Number(playerForm.playerGoals.value),
assists:Number(playerForm.playerAssists.value),
image:playerForm.playerImage.value
};

players = players.filter(p=>p.id!==player.id);
players.push(player);

localStorage.setItem("adminPlayers",JSON.stringify(players));

playerForm.reset();
displayPlayers();
updateStatDropdown();

});

function displayPlayers(){

const container=document.getElementById("playersList");
container.innerHTML="";

players.forEach(p=>{

container.innerHTML+=`
<div>
<strong>${p.name}</strong>
<button onclick="editPlayer(${p.id})">Edit</button>
<button onclick="deletePlayer(${p.id})">Delete</button>
</div>
`;

});

}

function deletePlayer(id){
players=players.filter(p=>p.id!==id);
localStorage.setItem("adminPlayers",JSON.stringify(players));
displayPlayers();
updateStatDropdown();
}

function editPlayer(id){

const p=players.find(x=>x.id===id);

document.getElementById("playerId").value=p.id;
playerForm.playerName.value=p.name;
playerForm.playerNickname.value=p.nickname;
playerForm.playerPosition.value=p.position;
playerForm.playerNumber.value=p.number;
playerForm.playerGoals.value=p.goals;
playerForm.playerAssists.value=p.assists;
playerForm.playerImage.value=p.image;

}

/* ================= MATCHES ================= */

const matchForm=document.getElementById("matchForm");

matchForm.addEventListener("submit",function(e){
e.preventDefault();

const id=document.getElementById("matchId").value || Date.now();

const match={
id:Number(id),
homeTeam:matchForm.homeTeam.value,
awayTeam:matchForm.awayTeam.value,
date:matchForm.matchDate.value,
time:matchForm.matchTime.value,
venue:matchForm.matchVenue.value,
status:matchForm.matchStatus.value,
homeScore:matchForm.homeScore.value,
awayScore:matchForm.awayScore.value
};

matches=matches.filter(m=>m.id!==match.id);
matches.push(match);

localStorage.setItem("adminMatches",JSON.stringify(matches));

matchForm.reset();
displayMatches();

});

function displayMatches(){

const container=document.getElementById("matchesList");
container.innerHTML="";

matches.forEach(m=>{

container.innerHTML+=`
<div>
<strong>${m.homeTeam} vs ${m.awayTeam}</strong>
<br>
${m.status==="completed" ?
`Score: ${m.homeScore} - ${m.awayScore}` :
"Upcoming"}

<button onclick="editMatch(${m.id})">Edit</button>
<button onclick="deleteMatch(${m.id})">Delete</button>
</div>
`;

});

}

function deleteMatch(id){
matches=matches.filter(m=>m.id!==id);
localStorage.setItem("adminMatches",JSON.stringify(matches));
displayMatches();
}

function editMatch(id){

const m=matches.find(x=>x.id===id);

document.getElementById("matchId").value=m.id;

matchForm.homeTeam.value=m.homeTeam;
matchForm.awayTeam.value=m.awayTeam;
matchForm.matchDate.value=m.date;
matchForm.matchTime.value=m.time;
matchForm.matchVenue.value=m.venue;
matchForm.matchStatus.value=m.status;
matchForm.homeScore.value=m.homeScore;
matchForm.awayScore.value=m.awayScore;

}

/* ================= STATS ================= */

function updateStatDropdown(){

const select=document.getElementById("statPlayerSelect");
select.innerHTML="";

players.forEach(p=>{
select.innerHTML+=`<option value="${p.id}">${p.name}</option>`;
});

}

function updatePlayerStats(){

const id=Number(document.getElementById("statPlayerSelect").value);

const player=players.find(p=>p.id===id);

if(!player) return;

player.goals=Number(prompt("New Goals",player.goals));
player.assists=Number(prompt("New Assists",player.assists));

localStorage.setItem("adminPlayers",JSON.stringify(players));

alert("Stats Updated");

}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded",function(){
displayPlayers();
displayMatches();
updateStatDropdown();
});
