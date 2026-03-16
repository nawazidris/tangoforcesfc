/* =========================
   SECURITY CHECK
========================= */

(function(){

const token = sessionStorage.getItem("adminToken");
const expiry = sessionStorage.getItem("adminExpiry");

if(!token || !expiry){
window.location.href="tango-admin-access.html";
return;
}

if(Date.now() > parseInt(expiry)){
alert("Session expired. Please login again.");
sessionStorage.clear();
window.location.href="tango-admin-access.html";
}

})();


/* =========================
   NAVIGATION
========================= */

function goHome(){
window.location.href="../index.html";
}

function logout(){
sessionStorage.clear();
window.location.href="tango-admin-access.html";
}


/* =========================
   AUTO LOGOUT (IDLE)
========================= */

let idleTime = 0;

function resetTimer(){
idleTime = 0;
}

function timerIncrement(){
idleTime++;
if(idleTime > 20){
alert("Logged out due to inactivity.");
logout();
}
}

setInterval(timerIncrement, 60000);

document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);
document.addEventListener("click", resetTimer);


/* =========================
   DATA STORAGE
========================= */

let adminPlayers = JSON.parse(localStorage.getItem("adminPlayers")) || [];
let adminMatches = JSON.parse(localStorage.getItem("adminMatches")) || [];


/* =========================
   DISPLAY PLAYERS
========================= */

function displayPlayersList(){

const container = document.getElementById("playersList");
container.innerHTML = "";

adminPlayers.forEach(player => {

const item = document.createElement("div");
item.className = "admin-list-item";

item.innerHTML = `
<div>
<strong>${player.name}</strong> - #${player.number}
</div>
<div>
<button class="btn-delete" onclick="deletePlayer(${player.id})">Delete</button>
</div>
`;

container.appendChild(item);

});

}


/* =========================
   DISPLAY MATCHES
========================= */

function displayMatchesList(){

const container = document.getElementById("matchesList");
container.innerHTML = "";

adminMatches.forEach(match => {

const item = document.createElement("div");
item.className = "admin-list-item";

item.innerHTML = `
<div>
<strong>${match.homeTeam} vs ${match.awayTeam}</strong>
<div>${match.date}</div>
</div>
<div>
<button class="btn-delete" onclick="deleteMatch(${match.id})">Delete</button>
</div>
`;

container.appendChild(item);

});

}


/* =========================
   DELETE FUNCTIONS
========================= */

function deletePlayer(id){

if(confirm("Delete player?")){
adminPlayers = adminPlayers.filter(p => p.id !== id);
localStorage.setItem("adminPlayers", JSON.stringify(adminPlayers));
displayPlayersList();
}

}

function deleteMatch(id){

if(confirm("Delete match?")){
adminMatches = adminMatches.filter(m => m.id !== id);
localStorage.setItem("adminMatches", JSON.stringify(adminMatches));
displayMatchesList();
}

}


/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", function(){
displayPlayersList();
displayMatchesList();
});
