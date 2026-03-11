let adminPlayers=[];
let adminMatches=[];

/* NAVIGATION */

function goHome(){

window.location.href="../index.html";

}

function logout(){

sessionStorage.clear();

window.location.href="tango-admin-access.html";

}

/* AUTO LOGOUT WHEN IDLE */

let idleTime=0;

function timerIncrement(){

idleTime++;

if(idleTime>20){

alert("Logged out due to inactivity");

logout();

}

}

setInterval(timerIncrement,60000);

document.onmousemove=resetTimer;
document.onkeypress=resetTimer;
document.onclick=resetTimer;

function resetTimer(){

idleTime=0;

}

/* LOAD DATA */

const loadAdminData=()=>{

let playersData=localStorage.getItem("adminPlayers");

if(playersData){

adminPlayers=JSON.parse(playersData);

}else{

adminPlayers=[

{id:1,name:"Edrice Mujeyi",nickname:"Nawaz",position:"Forward",number:25,goals:25,assists:8},

{id:2,name:"Bleja",nickname:"Speed Demon",position:"Forward",number:9,goals:22,assists:6}

];

localStorage.setItem("adminPlayers",JSON.stringify(adminPlayers));

}

let matchesData=localStorage.getItem("adminMatches");

if(matchesData){

adminMatches=JSON.parse(matchesData);

}

displayPlayersList();
displayMatchesList();

};

/* DISPLAY PLAYERS */

function displayPlayersList(){

const container=document.getElementById("playersList");

container.innerHTML="";

adminPlayers.forEach(player=>{

const item=document.createElement("div");

item.className="admin-list-item";

item.innerHTML=`

<div>

<strong>${player.name}</strong> - #${player.number}

</div>

<div class="admin-actions">

<button class="btn-edit" onclick="editPlayer(${player.id})">Edit</button>

<button class="btn-delete" onclick="deletePlayer(${player.id})">Delete</button>

</div>

`;

container.appendChild(item);

});

}

/* DISPLAY MATCHES */

function displayMatchesList(){

const container=document.getElementById("matchesList");

container.innerHTML="";

adminMatches.forEach(match=>{

const item=document.createElement("div");

item.className="admin-list-item";

item.innerHTML=`

<div>

<strong>${match.homeTeam} vs ${match.awayTeam}</strong>

<div>${match.date} • ${match.venue}</div>

</div>

<div class="admin-actions">

<button class="btn-edit" onclick="editMatch(${match.id})">Edit</button>

<button class="btn-delete" onclick="deleteMatch(${match.id})">Delete</button>

</div>

`;

container.appendChild(item);

});

}

/* DELETE PLAYER */

function deletePlayer(id){

if(confirm("Delete player?")){

adminPlayers=adminPlayers.filter(p=>p.id!==id);

localStorage.setItem("adminPlayers",JSON.stringify(adminPlayers));

displayPlayersList();

}

}

/* DELETE MATCH */

function deleteMatch(id){

if(confirm("Delete match?")){

adminMatches=adminMatches.filter(m=>m.id!==id);

localStorage.setItem("adminMatches",JSON.stringify(adminMatches));

displayMatchesList();

}

}

document.addEventListener("DOMContentLoaded",loadAdminData);
