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

// list of (user made) playlists retrieved
export const myPlaylistState = atom({
  key: 'myPlaylistState',
  default: null,
});

// current (user made) myplaylist id
export const myPlaylistIdState = atom({
  key: 'myPlaylistIdState',
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null,
});

// wether a track playing or not
export const activePlaylistState = atom({
  key: 'activePlaylistState',
  default: null,
});
