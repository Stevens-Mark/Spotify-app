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

// holds the current position ("progress") & total duration in a track/episode
export const progressDataState = atom({
  key: 'progressDataState',
  default: {
    duration: 0,
    progress: 0,
  },
});

// track whether shuffle on/off
export const shuffleStatusState = atom({
  key: 'shuffleStatusState',
  default: false,
});

// to limit how often the user can press remove from playlist so the server has time to process each request
export const cooldownState = atom({
  key: 'cooldownState',
  default: false,
});

// holds to value to determine either playlist or album to show in the sidebar
export const listToShowState = atom({
  key: 'listToShowState',
  default: 'all',
});

// holds to value to determine which playlist to show in the sidebar (owner or spotify)
export const playlistInUseState = atom({
  key: 'playlistInUseState',
  default: 'all',
});
