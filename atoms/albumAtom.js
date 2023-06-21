import { atom } from 'recoil';

// current album id
export const albumIdState = atom({
  key: 'albumIdState',
  default: null,
});

// track album id:  used to "sync" song & album highlights activation
export const currentAlbumIdState = atom({
  key: 'currentAlbumIdState',
  default: null,
});

// list of tracks in album
export const albumTrackListState = atom({
  key: 'albumTrackListState',
  default: null,
});