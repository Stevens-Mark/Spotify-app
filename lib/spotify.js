import SpotifyWebApi from 'spotify-web-api-node';
// https://github.com/thelinmichael/spotify-web-api-node

// https://developer.spotify.com/documentation/web-api/concepts/scopes
// Scopes are needed when implementing some of the authorization grant types
const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-playback-position',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'user-read-email',
  'user-read-private',
].join(' ');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;
export {
  scopes,
};
