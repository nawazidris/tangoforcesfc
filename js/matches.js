let allMatches = [];

async function fetchMatches(){

    const container = document.getElementById("matchesContainer");

    container.innerHTML = `<div class="loading">Loading matches...</div>`;

    try{

        const response = await fetch("data/matches.json");
        const matches = await response.json();

        allMatches = matches;

        displayMatches(allMatches);

    }catch(err){

        console.error(err);

        container.innerHTML = `
        <div class="error">
        ⚠️ Failed to load matches
        </div>
        `;

    }
}

function renderEvents(match,team){

    if(!match.events) return "";

    const events = match.events.filter(e=>e.team===team);

    if(events.length===0) return "";

    return `
    <div class="team-events">

    ${events.map(event=>{

        let icon="";
        let text="";

        switch(event.type){

            case "goal":
                icon="⚽";
                text=`${event.player} ${event.minute}'`;
                if(event.assist){
                    text+=` <span class="assist">(A: ${event.assist})</span>`;
                }
            break;

            case "penalty_goal":
                icon="⚽";
                text=`${event.player} ${event.minute}' (P)`;
            break;

            case "own_goal":
                icon="⚽";
                text=`${event.player} ${event.minute}' (OG)`;
            break;

            case "yellow_card":
                icon="🟨";
                text=`${event.player} ${event.minute}'`;
            break;

            case "red_card":
                icon="🟥";
                text=`${event.player} ${event.minute}'`;
            break;

            case "substitution":
                icon="🔁";
                text=`${event.player_in} ↔ ${event.player_out}`;
            break;
        }

        return `<div class="event">${icon} ${text}</div>`;

    }).join("")}

    </div>
    `;
}

function displayMatches(matches){

    const container=document.getElementById("matchesContainer");

    container.innerHTML="";

    matches.forEach(match=>{

        const isCompleted = match.status==="completed";

        const card=document.createElement("div");

        card.className="match-card";

        card.innerHTML=`

        <div class="match-header">

            <span>${new Date(match.date).toDateString()}</span>
            <span>${match.time}</span>
            <span class="competition">${match.competition}</span>

        </div>

        <div class="teams">

            <div class="team home">

                <div class="team-row">

                    <span class="team-name">${match.homeTeam}</span>
                    <span class="score">${isCompleted ? match.homeScore : "-"}</span>

                </div>

                ${isCompleted ? renderEvents(match,"home") : ""}

            </div>

            <div class="vs">

                ${isCompleted ? `${match.homeScore} - ${match.awayScore}` : "VS"}

            </div>

            <div class="team away">

                <div class="team-row">

                    <span class="score">${isCompleted ? match.awayScore : "-"}</span>
                    <span class="team-name">${match.awayTeam}</span>

                </div>

                ${isCompleted ? renderEvents(match,"away") : ""}

            </div>

        </div>

        <div class="venue">📍 ${match.venue}</div>

        `;

        container.appendChild(card);

    });

}

document.addEventListener("DOMContentLoaded",fetchMatches);
