/**
 * dataStore.js — Tango FC shared data layer
 * ==========================================
 * Single source of truth for all pages.
 * - Admin writes here.
 * - All public pages read from here.
 * - JSON files are the seed/fallback only.
 *
 * Keys used in localStorage:
 *   adminPlayers         — full player objects (admin-managed)
 *   adminMatches         — full match objects with events
 *   leagueStandingsJson  — { headers, rows } for the league table
 *   allPlayers           — public-facing player list (kept in sync)
 */

const DS = (() => {

    /* ── keys ── */
    const KEYS = {
        players:   'adminPlayers',
        matches:   'adminMatches',
        standings: 'leagueStandingsJson',
        allPlayers:'allPlayers',
    };

    /* ── raw read / write ── */
    function _get(key)        { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
    function _set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

    /* ════════════════════════════════════════
       PLAYERS
    ════════════════════════════════════════ */

    function getPlayers() {
        return _get(KEYS.players) || [];
    }

    function savePlayers(arr) {
        _set(KEYS.players, arr);
        // keep allPlayers in sync so public pages (roster, stats) see the same data
        _set(KEYS.allPlayers, arr);
    }

    function upsertPlayer(player) {
        const players = getPlayers();
        const idx = players.findIndex(p => p.id === player.id);
        if (idx > -1) players[idx] = player; else players.push(player);
        savePlayers(players);
        return players;
    }

    function deletePlayer(id) {
        const players = getPlayers().filter(p => p.id !== id);
        savePlayers(players);
        return players;
    }

    /** Recompute goals/assists for every player from completed match events. */
    function recomputePlayerStats() {
        const players = getPlayers();
        const matches = getMatches();

        // reset
        players.forEach(p => { p.goals = 0; p.assists = 0; p.cleanSheets = 0; p.matchesPlayed = 0; });

        matches.forEach(m => {
            if (m.status !== 'completed') return;

            // track who played (home + away team players from events)
            const playersInMatch = new Set();

            (m.events || []).forEach(e => {
                const p = players.find(x => x.name === e.player);
                if (!p) return;
                playersInMatch.add(p.name);

                if (e.type === 'goal') {
                    p.goals = (p.goals || 0) + 1;
                    if (e.assist) {
                        const a = players.find(x => x.name === e.assist);
                        if (a) { a.assists = (a.assists || 0) + 1; playersInMatch.add(a.name); }
                    }
                }
            });

            // clean sheets: goalkeeper whose team conceded 0
            const hs = parseInt(m.homeScore) || 0;
            const as = parseInt(m.awayScore) || 0;
            const tangoIsHome = (m.homeTeam || '').toLowerCase().includes('tango');
            const tangoIsAway = (m.awayTeam || '').toLowerCase().includes('tango');

            if ((tangoIsHome && as === 0) || (tangoIsAway && hs === 0)) {
                players.forEach(p => {
                    if ((p.position || '').toLowerCase() === 'goalkeeper') {
                        p.cleanSheets = (p.cleanSheets || 0) + 1;
                    }
                });
            }

            playersInMatch.forEach(name => {
                const p = players.find(x => x.name === name);
                if (p) p.matchesPlayed = (p.matchesPlayed || 0) + 1;
            });
        });

        savePlayers(players);
        return players;
    }

    /* ════════════════════════════════════════
       MATCHES
    ════════════════════════════════════════ */

    function getMatches() {
        return _get(KEYS.matches) || [];
    }

    function saveMatches(arr) {
        _set(KEYS.matches, arr);
    }

    function upsertMatch(match) {
        const matches = getMatches();
        const idx = matches.findIndex(m => m.id == match.id);
        if (idx > -1) matches[idx] = match; else matches.push(match);
        saveMatches(matches);
        // always recompute stats after any match change
        recomputePlayerStats();
        return matches;
    }

    function deleteMatch(id) {
        const matches = getMatches().filter(m => m.id != id);
        saveMatches(matches);
        recomputePlayerStats();
        return matches;
    }

    /* ════════════════════════════════════════
       STANDINGS
    ════════════════════════════════════════ */

    function getStandings() {
        return _get(KEYS.standings);
    }

    function saveStandings(parsed) {
        _set(KEYS.standings, parsed);
    }

    /* ════════════════════════════════════════
       SEED LOADERS  (called on first load)
    ════════════════════════════════════════ */

    async function seedPlayersIfEmpty() {
        if (getPlayers().length > 0) return;
        try {
            const res = await fetch('data/players.json');
            if (!res.ok) return;
            const json = await res.json();
            savePlayers(json);
        } catch (e) {
            console.warn('Could not seed players from data/players.json', e);
        }
    }

    async function seedStandingsIfEmpty() {
        if (getStandings()) return;
        try {
            const res = await fetch('data/log.json');
            if (!res.ok) return;
            const json = await res.json();
            if (json?.headers && json?.rows) saveStandings(json);
        } catch (e) {
            console.warn('Could not seed standings from data/log.json', e);
        }
    }

    /* ════════════════════════════════════════
       SEASON SUMMARY  (computed, not stored)
    ════════════════════════════════════════ */

    function getSeasonSummary() {
        const matches = getMatches().filter(m => m.status === 'completed');
        let w = 0, d = 0, l = 0, gf = 0, ga = 0;

        matches.forEach(m => {
            const hs = parseInt(m.homeScore) || 0;
            const as = parseInt(m.awayScore) || 0;
            const tangoHome = (m.homeTeam || '').toLowerCase().includes('tango');
            const tangoAway = (m.awayTeam || '').toLowerCase().includes('tango');
            if (!tangoHome && !tangoAway) return;

            const tScore = tangoHome ? hs : as;
            const oScore = tangoHome ? as : hs;
            gf += tScore; ga += oScore;
            if (tScore > oScore) w++;
            else if (tScore === oScore) d++;
            else l++;
        });

        const played = w + d + l;
        const pts    = w * 3 + d;
        const gd     = gf - ga;

        return {
            played, w, d, l, pts, gf, ga, gd,
            goalsPerMatch:  played ? (gf / played).toFixed(2) : '0.00',
            pointsPerGame:  played ? (pts / played).toFixed(2) : '0.00',
            winPct:         played ? Math.round((w / played) * 100) + '%' : '0%',
        };
    }

    /* ════════════════════════════════════════
       REAL FORM  (from results.json or matches)
    ════════════════════════════════════════ */

    async function getFormMap() {
        // Prefer results.json (full league results) if present
        let allMatches = [];
        try {
            const res = await fetch('data/results.json');
            if (res.ok) {
                const json = await res.json();
                allMatches = json.matches || [];
            }
        } catch { /* fall through */ }

        // Also include admin matches
        getMatches().filter(m => m.status === 'completed').forEach(m => {
            const hs = parseInt(m.homeScore);
            const as = parseInt(m.awayScore);
            if (!isNaN(hs) && !isNaN(as)) {
                allMatches.push({ week: m.date || 9999, home: m.homeTeam, homeScore: hs, awayScore: as, away: m.awayTeam });
            }
        });

        // Build map: teamName → array of 'W'/'D'/'L' in chronological order
        const formMap = {};
        allMatches.forEach(m => {
            if (m.homeScore === null || m.awayScore === null) return;
            const hs = parseInt(m.homeScore);
            const as = parseInt(m.awayScore);
            if (isNaN(hs) || isNaN(as)) return;

            [m.home, m.away].forEach(team => {
                if (!formMap[team]) formMap[team] = [];
                const isHome = team === m.home;
                const ts = isHome ? hs : as;
                const os = isHome ? as : hs;
                formMap[team].push(ts > os ? 'W' : ts < os ? 'L' : 'D');
            });
        });

        return formMap;
    }

    /* ════════════════════════════════════════
       EXPORT  (download updated JSON files)
    ════════════════════════════════════════ */

    function exportJson(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportPlayers()   { exportJson(getPlayers(), 'players.json'); }
    function exportMatches()   { exportJson(getMatches(), 'matches.json'); }
    function exportStandings() {
        const s = getStandings();
        if (s) exportJson(s, 'log.json');
    }

    /* ════════════════════════════════════════
       PUBLIC API
    ════════════════════════════════════════ */
    return {
        // players
        getPlayers, savePlayers, upsertPlayer, deletePlayer, recomputePlayerStats,
        // matches
        getMatches, saveMatches, upsertMatch, deleteMatch,
        // standings
        getStandings, saveStandings,
        // computed
        getSeasonSummary, getFormMap,
        // seeds
        seedPlayersIfEmpty, seedStandingsIfEmpty,
        // exports
        exportPlayers, exportMatches, exportStandings,
    };
})();

window.DS = DS;
