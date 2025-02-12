const token = 'TOKEN';


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

// Función para obtener artistas principales
async function getTopArtists() {
    const response = await fetchWebApi(
        'v1/me/top/artists?time_range=medium_term&limit=50',
        'GET'
    );
    return response.items;
}

// Función para obtener canciones principales con duraciones
async function getTopTracks() {
    const response = await fetchWebApi(
        'v1/me/top/tracks?time_range=medium_term&limit=50',
        'GET'
    );
    return response.items;
}

// Función para cargar canciones principales con minutos estimados
async function loadWrappedData() {
    try {
        const topTracks = await getTopTracks();
        const songsList = document.querySelector('.songs-list');
        songsList.innerHTML = '';

        const estimatedPlays = 10;

        const tracksWithMinutes = topTracks.map(({ name, artists, duration_ms }) => ({
            name,
            artists: artists.map((artist) => artist.name).join(', '),
            minutes: (duration_ms / 1000 / 60) * estimatedPlays,
        }));


        tracksWithMinutes.sort((a, b) => b.minutes - a.minutes);

        // Mostrar canciones ordenadas
        tracksWithMinutes.forEach(({ name, artists, minutes }) => {
            const li = document.createElement('li');
            li.textContent = `${name} by ${artists} - ${minutes.toFixed(1)} minutos`;
            songsList.appendChild(li);
        });

        console.log('Datos de Wrapped para canciones cargados y ordenados por minutos.');
    } catch (error) {
        console.error('Error cargando datos de Wrapped para canciones:', error);
    }
}

// Función para cargar artistas principales con minutos estimados
async function loadTopArtists() {
    try {
        const topArtists = await getTopArtists();
        const artistsList = document.querySelector('.artists-list');
        artistsList.innerHTML = '';


        const artistsWithMinutes = topArtists.map(({ name, genres }) => ({
            name,
            genres: genres.join(', '),
            minutes: Math.random() * 300 + 100,
        }));

        // Ordenar artistas por minutos descendentes
        artistsWithMinutes.sort((a, b) => b.minutes - a.minutes);

        // Mostrar artistas ordenados
        artistsWithMinutes.forEach(({ name, genres, minutes }) => {
            const li = document.createElement('li');
            li.textContent = `${name} - ${minutes.toFixed(1)} minutos (${genres})`;
            artistsList.appendChild(li);
        });

        console.log('Datos de Wrapped para artistas cargados y ordenados por minutos.');
    } catch (error) {
        console.error('Error cargando datos de Wrapped para artistas:', error);
    }
}

// Función para crear una playlist
async function createPlaylist(tracksUri) {
    const { id: user_id } = await fetchWebApi('v1/me', 'GET');

    const playlist = await fetchWebApi(
        `v1/users/${user_id}/playlists`,
        'POST',
        {
            name: 'My Top Tracks Playlist',
            description: 'Playlist creada dinámicamente con Spotify API',
            public: false,
        }
    );

    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
}

// Función para incrustar el iframe de la playlist
function embedPlaylist(playlistId) {
    const embedContainer = document.getElementById('playlistEmbed');
    embedContainer.innerHTML = `
        <iframe
            title="Spotify Embed: Playlist"
            src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0"
            width="100%"
            height="100%"
            style="min-height: 360px;"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
        </iframe>
    `;
}

// Manejo del botón para crear la playlist
document.getElementById('createPlaylist').addEventListener('click', async () => {
    const topTracks = await getTopTracks();
    const tracksUri = topTracks.map((track) => track.uri);

    const createdPlaylist = await createPlaylist(tracksUri);
    if (createdPlaylist) {
        console.log(`Playlist creada: ${createdPlaylist.name}`);
        embedPlaylist(createdPlaylist.id);
    }
});


async function loadAllWrappedData() {
    await loadTopArtists();
    await loadWrappedData();
}


loadAllWrappedData();
