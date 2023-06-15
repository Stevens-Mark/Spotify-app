import { atom } from 'recoil';

// list of tracks in artist
export const artistTrackListState = atom({
  key: 'artistTrackListState',
  default: null,
});

// list of track uris for top 10 artist tracks
export const artistTrackUrisState = atom({
  key: 'artistTrackUrisState',
  default: null,
});