document.addEventListener('DOMContentLoaded', () => {
    loadLeagueStandings();
});

async function loadLeagueStandings() {
    const container = document.getElementById('standingsTableContainer');
    const noData = document.getElementById('standingsNoData');

    if (!container || !noData) return;

    let parsed = null;
    const localRaw = localStorage.getItem('leagueStandingsJson');

    if (localRaw) {
        parsed = safeParseLeagueJson(localRaw);
        if (!parsed) {
            console.warn('Invalid local standings JSON, falling back to log.json');
        }
    }

    if (!parsed) {
        parsed = await loadStandingsFromLogJson();
    }

    if (!parsed || !parsed.headers || !parsed.rows || !parsed.rows.length) {
        container.innerHTML = '';
        noData.style.display = 'block';
        noData.textContent = 'No league standings have been uploaded yet.';
        return;
    }

    noData.style.display = 'none';
    renderLeagueTable(parsed, container);
}

function safeParseLeagueJson(raw) {
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('League standings parse error:', error);
        return null;
    }
}

async function loadStandingsFromLogJson() {
    try {
        const response = await fetch('data/log.json');
        if (!response.ok) {
            console.warn('Could not fetch data/log.json:', response.statusText);
            return null;
        }

        const json = await response.json();
        if (!json || !json.headers || !json.rows) {
            console.warn('data/log.json does not contain valid standings structure');
            return null;
        }

        return json;
    } catch (error) {
        console.warn('Failed to load data/log.json:', error);
        return null;
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
