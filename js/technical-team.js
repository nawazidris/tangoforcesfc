const technicalTeam = [
    {
        id: 1,
        name: "Taruvinga Mutangiranwa",
        role: "CEO",
        title: "Chief Executive Officer",
        image: "images/tango.jpg",
        experience: "10 years",
        description: "Leading the club with vision"
    },
    {
        id: 2,
        name: "Alious Jamela",
        role: "Director",
        title: "Football Director",
        image: "images/jamela.jpg",
        experience: "10 years",
        description: "Overseeing football operations"
    },
    {
        id: 3,
        name: "Pride Chikunguru",
        role: "Team Manager",
        title: "Team Manager - Logistics & Operations",
        image: "images/thembie.jpg",
        experience: "7 years",
        description: "Leading team strategy"
    },
    {
        id: 4,
        name: "Edrice Mujeyi",
        role: "Captain",
        title: "Team Captain",
        image: "images/idris.jpg",
        experience: "8 years",
        description: "Team Captain - Player Coach"
    },
    {
        id: 5,
        name: "Newsber Kwangwa",
        role: "Coach",
        title: "Assistant Coach - Offensive",
        image: "images/newz.jpg",
        experience: "8 years",
        description: "Offensive strategy specialist"
    },
    {
        id: 6,
        name: "Robert Marongwe",
        role: "Assistant Coach",
        title: "Goalkeeper Coach - Defensive",
        image: "images/robho.jpg",
        experience: "7 years",
        description: "Defensive tactics expert"
    },

    {
        id: 7,
        name: "Milton Bosha",
        role: "Logistics Manager",
        title: "Logistics Manager",
        image: "images/milito1.jpg",
        experience: "8 years",
        description: "Logistics and Operations Manager"
    },
    {
        id: 8,
        name: "Paida Tsuro",
        role: "Head of Recruitment",
        title: "Chief Scout",
        image: "images/paida.jpg",
        experience: "8 years",
        description: "Recruitment Analyst"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const technicalContainer = document.getElementById('technicalTeam');
    
    if (technicalContainer) {
        // Build hierarchy: CEO on top, next 3 in middle row, rest in bottom row
        const ceo = technicalTeam.find(m => m.role.toLowerCase() === 'ceo') || technicalTeam[0];
        const others = technicalTeam.filter(m => m !== ceo);
        const middle = others.slice(0, 2);
        const bottom = others.slice(3);

        const topRow = document.createElement('div');
        topRow.className = 'technical-row top';
        if (ceo) topRow.appendChild(createTechnicalCard(ceo));

        const middleRow = document.createElement('div');
        middleRow.className = 'technical-row middle';
        middle.forEach(member => middleRow.appendChild(createTechnicalCard(member)));

        const bottomRow = document.createElement('div');
        bottomRow.className = 'technical-row bottom';
        bottom.forEach(member => bottomRow.appendChild(createTechnicalCard(member)));

        technicalContainer.appendChild(topRow);
        technicalContainer.appendChild(middleRow);
        technicalContainer.appendChild(bottomRow);
    }
});

function createTechnicalCard(member) {
    const card = document.createElement('div');
    card.className = `technical-card ${member.role.toLowerCase().replace(/\s+/g, '-')}`;
    card.innerHTML = `
        <div class="technical-card-inner">
            <div class="technical-image">
                <img src="${member.image}" alt="${member.name}" class="team-member-photo">
            </div>
            <h3>${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <p class="member-title">${member.title}</p>
            <div class="member-info">
                <span class="experience">📅 ${member.experience}</span>
            </div>
            <p class="member-description">"${member.description}"</p>
        </div>
    `;
    return card;

}


