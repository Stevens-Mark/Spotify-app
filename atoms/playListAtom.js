import { atom } from 'recoil';

// current playlist id
export const playlistIdState = atom({
  key: 'playlistIdState',
  default: null,
});

// list of tracks in playlist
export const playlistTrackListState = atom({
  key: 'playlistTrackListState',
  default: null,
});

// playlist playing or not
export const activePlaylistState = atom({
  key: 'activePlaylistState',
  default: null,
});


// list of user's playlists retrieved
export const myPlaylistState = atom({
  key: 'myPlaylistState',
  default: null,
});

// current myplaylist id
export const myPlaylistIdState = atom({
  key: 'myPlaylistIdState',
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null,
});