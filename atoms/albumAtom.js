import { atom } from 'recoil';

// current album id
export const albumIdState = atom({
  key: 'albumIdState',
  default: null,
});

// list of tracks in album
export const albumTrackListState = atom({
  key: 'albumTrackListState',
  default: null,
});