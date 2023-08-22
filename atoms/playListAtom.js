import { atom } from 'recoil';

// current playlist id of playlist that has been selected/opened on playlist page
export const playlistIdState = atom({
  key: 'playlistIdState',
  default: null,
});

// list of tracks in playlist
export const playlistTrackListState = atom({
  key: 'playlistTrackListState',
  default: [],
});

// current (user made) playlist (from sidebar) showing on the screen
export const activePlaylistIdState = atom({
  key: 'activePlaylistIdState',
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null,
});

// whether a track playing or not from user playlist (used for setting speaker in sidebar)
export const activePlaylistState = atom({
  key: 'activePlaylistState',
  default: null,
});

// contains list of All users playlists they've saved or created
export const myPlaylistState = atom({
  key: 'myPlaylistState',
  default: null,
});

// contains list of Only users playlists they've created
export const onlyUsersPlaylistState = atom({
  key: 'onlyUsersPlaylistState',
  default: null,
});

// contains list of Only users playlists they've created
export const spotifyPlaylistState = atom({
  key: 'spotifyPlaylistState',
  default: null,
});