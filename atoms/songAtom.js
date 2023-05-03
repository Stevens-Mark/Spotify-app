import { atom } from 'recoil';

export const State = atom({
  key: 'State', // Unique ID (with respect to other atoms/selectors)
  default: null, // initial state
});

export const isPlayState = atom({
  key: 'isPlayState',
  default: false,
});

export const currentSongIndexState = atom({
  key: 'currentSongIndexState',
  default: null,
});

export const currentTrackIdState = atom({
  key: 'currentTrackIdState',
  default: null,
});
