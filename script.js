const clientId = CONFIG.clientId;
const clientSecret = CONFIG.clientSecret;

async function getAccessToken() {
  try {
    let result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      })
    });

    let data = await result.json();
    let accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.log(error);
  }
}

async function getNewReleases(count) {
  try {
    const accessToken = await getAccessToken();
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow'
    };

    let res = await fetch(`https://api.spotify.com/v1/browse/new-releases?country=US&offset=0&limit=${count}`, requestOptions);
    const data = await res.json();
    const albums = data.albums.items;
    return albums;
  } catch (error) {
    console.log(error);
  }
}

async function renderAlbums(count = 20) {
  const albumsCards = await getNewReleases(count);
  const container = document.getElementById("albums-list");
  container.innerHTML = "";

  for (let i = 0; i < albumsCards.length; i++) {
    const album = albumsCards[i];
    const card = document.createElement("div");
    card.className = "albums__card";
    card.innerHTML = `
      <a href="album.html?id=${album.id}" class="albums_card__link">
        <img src="${album.images[1].url}" alt="albums_card__image" class="card__image">
        <p class="albums__card__title">${album.name}</p>
      </a>
      `;
    container.appendChild(card);
  }
}
async function getAlbumDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  try {
    const accessToken = await getAccessToken();
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow'
    };

    let res = await fetch(`https://api.spotify.com/v1/albums/${id}`, requestOptions);
    const data = await res.json();

    const container = document.getElementById("details");
    container.innerHTML = `
        <img src="${data.images[1].url}" alt="album_image" class="album__image">
        <div class="album__content">
          <h3 class="album__name">${data.name}</h3>
          <p class="album__artists">${data.artists.map(artist => artist.name).join(', ')}</p>
          <p class="album__release_date">Release Date: ${data.release_date}</p>
          <p class="album__total_tracks">Total Tracks: ${data.total_tracks}</p>
        </div>
      `;
  } catch (error) {
    console.log(error);
  }
}

async function getArtists() {
  try {
    const accessToken = await getAccessToken();
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow'
    };

    let res = await fetch(`https://api.spotify.com/v1/search?q=metalica&type=artist&limit=20`, requestOptions);
    const data = await res.json();
    const artists = data.artists.items;
    return artists;
  } catch (error) {
    console.log(error);
  }
}

async function renderArtists() {
  const artistsCards = await getArtists();
  const container = document.getElementById("albums-list");
  container.innerHTML = "";

  for (let i = 0; i < artistsCards.length; i++) {
    const artist = artistsCards[i];
    const card = document.createElement("div");
    card.className = "albums__card";
    card.innerHTML = `
        <a href="artist.html?id=${artist.id}" class="albums_card__link">
          <img src="${artist.images[1].url}" alt="albums_card__image" class="card__image">
          <p class="albums__card__title">${artist.name}</p>
        </a>
      `;
    container.appendChild(card);
  }
}
async function getArtistDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  try {
    const accessToken = await getAccessToken();
    const requestOptions = {

      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow'
    };

    let res = await fetch(`https://api.spotify.com/v1/artists/${id}`, requestOptions);
    const data = await res.json();

    const container = document.getElementById("details");
    container.innerHTML = `
        <img src="${data.images[1].url}" alt="album_image" class="album__image">
        <div class="album__content">
          <h3 class="album__name">${data.name}</h3>
          <p class="album__genres">Genres: ${data.genres.join(', ')}</p>
          <p class="album__followers">Followers: ${data.followers.total}</p>
          <p class="album__popularity">Popularity: ${data.popularity}</p>
        </div>
      `;
  } catch (error) {
    console.log(error);
  }
}

switch (window.location.pathname) {
  case "/index.html":
    renderAlbums(6);
    break;
  case "/albums.html":
    renderAlbums();
    break;
  case "/album.html":
    getAlbumDetails();
    break;
  case "/artists.html":
    renderArtists();
    break;
  case "/artist.html":
    getArtistDetails();
    break;
  default:
    break;
}
