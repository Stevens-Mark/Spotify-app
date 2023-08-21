import { atom } from 'recoil';

// current album id used to "sync" song & album highlights activation
export const albumIdState = atom({
  key: 'albumIdState',
  default: null,
});

// list of tracks in album
export const albumTrackListState = atom({
  key: 'albumTrackListState',
  default: [],
});

// contains list of All users saved albums
export const mySavedAlbumsState = atom({
  key: 'mySavedAlbumsState',
  default: null,
});