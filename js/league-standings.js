document.addEventListener('DOMContentLoaded', () => {
    loadLeagueStandings();
});

function loadLeagueStandings() {
    const container = document.getElementById('standingsTableContainer');
    const noData = document.getElementById('standingsNoData');

    if (!container || !noData) return;

    const raw = localStorage.getItem('leagueStandingsJson');
    if (!raw) {
        container.innerHTML = '';
        noData.style.display = 'block';
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.headers || !parsed.rows || !parsed.rows.length) {
            container.innerHTML = '';
            noData.textContent = 'The uploaded standings file did not contain valid rows.';
            noData.style.display = 'block';
            return;
        }

        noData.style.display = 'none';
        renderLeagueTable(parsed, container);
    } catch (error) {
        container.innerHTML = '';
        noData.textContent = 'Unable to read league standings. Please re-upload from the admin page.';
        noData.style.display = 'block';
        console.error('League standings parse error:', error);
    }
}

function renderLeagueTable(parsed, container) {
    const table = document.createElement('table');
    table.className = 'standings-table';

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
        const rowString = row.join(' ').toLowerCase();
        if (rowString.includes('tango fc')) {
            tr.classList.add('highlight');
        }

        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
}
