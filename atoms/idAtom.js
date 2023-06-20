import { atom } from 'recoil';

// track which card has been selected by user: help play/pause icon activation
export const currentItemIdState = atom({
  key: 'currentItemIdState', 
  default: null,
});

// track album id:  used to "sync" song & album highlights activation
export const currentAlbumIdState = atom({
  key: 'currentAlbumIdState',
  default: null,
});

// used to set what type of player info to display
export const playerInfoTypeState = atom({
  key: 'playerInfoTypeState',
  default: null,
});