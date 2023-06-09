import { atom } from 'recoil';

// track which card has been selected by user: help play/pause icon activation
export const currentItemIdState = atom({
  key: 'currentPlaylistIdState',
  default: null,
});

// track album id:  used to "sync" song & album highlights activation
export const currentAlbumIdState = atom({
  key: 'currentAlbumIdState',
  default: null,
});