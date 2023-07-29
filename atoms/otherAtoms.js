import { atom } from 'recoil';

// set the number of items to display (pagnation) globally
export const itemsPerPageState = atom({
  key: 'itemsPerPageState ',
  default: 14,
});

// keep track on naviagtion position for nav buttons
export const navIndexState = atom({
  key: 'navIndexState',
  default: 1,
});

// track which card has been selected by user: help play/pause icon activation
export const currentItemIdState = atom({
  key: 'currentItemIdState',
  default: null,
});

// helps track which album,artist,playlist,liked song list etc a track/song came from: help play/pause control for quickplayer
export const originIdState = atom({
  key: 'originIdState',
  default: null,
});

// used to set what type of player info to display
export const playerInfoTypeState = atom({
  key: 'playerInfoTypeState',
  default: null,
});

// used for sticky banner background color setting complementary color with image
export const backgroundColorState = atom({
  key: 'backgroundColorState',
  default: null,
});

// holds the current position ("progress") in a track/episode
export const progressDataState = atom({
  key: 'progressDataState',
  default: {
    duration: 0,
    progress: 0,
  },
});
