import { atom } from 'recoil';

// current playlist id of playlist that has been selected/opened on playlist page
export const playlistIdState = atom({
  key: 'playlistIdState',
  default: null,
});

// list of tracks in playlist
export const playlistTrackListState = atom({
  key: 'playlistTrackListState',
  default: null,
});

// // list of (user made) playlists retrieved
// export const myPlaylistState = atom({
//   key: 'myPlaylistState',
//   default: null,
// });

// current (user made) playlist (from sidebar) showing on the screen
export const activePlaylistIdState = atom({
  key: 'activePlaylistIdState',
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null,
});

// whether a track playing or not in quickplayerbanners
export const activePlaylistState = atom({
  key: 'activePlaylistState',
  default: null,
});
