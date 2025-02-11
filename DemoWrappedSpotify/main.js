const token = 'BQAODyLU3VnfipAsXrEEpy28dSMsAaMtTpJyJmDe9YKi8bwxhjL4IPMBTF49NlGq2NI3TOWTyIbzmAQvqB09JuJeYVX9y-TzTUHCS2mdIowDDx_TvxKgzROXm1_NPpSwY0JWyVWZXm9JBKP-oon7xV_TMRjeJX4ouNYbXWgyFR9m1ePMXSs1W9Fp09nMg3MNNVkotD40MYEhPuthdX547NSAeZKwKp6r0FREo5XomApof1OK6KdPbpiaBZ-ETYmcjs5fORxOsWJ41BQhG8cJIbIIuMtiY1rB';
/*
const token = 'BQBp6s7PmqSZezLGfOAUZfihAUOATYWKO13CqTdRpYwfgZNj49wSk-RYocY-8uCHooZdJaPlFtu4PqPAP26piudJX4p_BFXPo9kSS8G0b_XSMyMGWhluxo0I9e__ZaHlDB_C_YBCcf1kc8aDh31J8okamDlQ9YTgr7_mfA7b5JeN-FHcOkFNXvyzj9IWlZPsvyquGIBwNIJrE6KgkFFvHK2GVIOFQ4vQsnJElU-hY7LdgC90EVH2Ky-d5FBYDx9k0XO8zhws21o';
*/

const currentYear = new Date().getFullYear();

// Función para hacer solicitudes a la API de Spotify
async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body),
    });
    return await res.json();
}

// Función para obtener canciones principales con filtro de este año
async function getTopTracksThisYear() {
    const response = await fetchWebApi(
        'v1/me/top/tracks?time_range=medium_term&limit=15',
        'GET'
    );

    // Filtrar canciones lanzadas este año
    const tracksThisYear = response.items.filter(({ album }) =>
        album.release_date.startsWith(`${currentYear}`)
    );

    return tracksThisYear;
}

// Función para cargar canciones principales de este año, ordenadas por minutos
async function loadWrappedDataThisYear() {
    try {
        const topTracks = await getTopTracksThisYear();
        const songsList = document.querySelector('.songs-list');
        songsList.innerHTML = '';

        const estimatedPlays = 10;

        const tracksWithMinutes = topTracks.map(({ name, artists, duration_ms }) => ({
            name,
            artists: artists.map((artist) => artist.name).join(', '),
            minutes: (duration_ms / 1000 / 60) * estimatedPlays,
        }));

        tracksWithMinutes.sort((a, b) => b.minutes - a.minutes);

        tracksWithMinutes.forEach(({ name, artists, minutes }) => {
            const li = document.createElement('li');
            li.textContent = `${name} by ${artists} - ${minutes.toFixed(1)} minutos`;
            songsList.appendChild(li);
        });

        console.log('Datos de Wrapped para canciones de este año cargados y ordenados por minutos.');
    } catch (error) {
        console.error('Error cargando datos de Wrapped para canciones de este año:', error);
    }
}

// Función para obtener artistas principales relacionados con canciones de este año
async function getTopArtistsThisYear() {
    const topTracks = await getTopTracksThisYear(); // Obtén canciones lanzadas este año
    const artistMap = new Map();

    // Acumula minutos estimados por artista
    topTracks.forEach(({ artists, duration_ms }) => {
        const durationMinutes = (duration_ms / 1000 / 60) * 10; // Minutos estimados por canción
        artists.forEach(({ name }) => {
            if (!artistMap.has(name)) {
                artistMap.set(name, { name, minutes: 0 });
            }
            artistMap.get(name).minutes += durationMinutes;
        });
    });

    const artistsWithMinutes = Array.from(artistMap.values());
    artistsWithMinutes.sort((a, b) => b.minutes - a.minutes);

    return artistsWithMinutes;
}

// Función para cargar artistas principales
async function loadTopArtistsThisYear() {
    try {
        const topArtists = await getTopArtistsThisYear();
        const artistsList = document.querySelector('.artists-list');
        artistsList.innerHTML = '';


        topArtists.forEach(({ name, minutes }) => {
            const li = document.createElement('li');
            li.textContent = `${name} - ${minutes.toFixed(1)} minutos`;
            artistsList.appendChild(li);
        });

        console.log('Datos de Wrapped para artistas de este año cargados y ordenados por minutos.');
    } catch (error) {
        console.error('Error cargando datos de Wrapped para artistas de este año:', error);
    }
}


async function loadAllWrappedDataThisYear() {
    await loadTopArtistsThisYear();
    await loadWrappedDataThisYear();
}


loadAllWrappedDataThisYear();
