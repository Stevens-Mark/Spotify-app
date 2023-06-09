import { atom } from 'recoil';

// current playlist id
export const playlistIdState = atom({
  key: 'playlistIdState',
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null,
});

// list of user's playlists retrieved
export const playlistState = atom({
  key: 'playlistState',
  default: null,
});

// playlist playing or not
export const activePlaylistState = atom({
  key: 'activePlaylistState',
  default: null,
});
