import { atom } from 'recoil';

// track which card has been selected by user: help play/pause icon activation
export const currentItemIdState = atom({
  key: 'currentItemIdState',
  default: null,
});

// used to set what type of player info to display
export const playerInfoTypeState = atom({
  key: 'playerInfoTypeState',
  default: null,
});

// whether currentItemId triggered by a song
export const triggeredBySongState = atom({
  key: 'triggeredBySongState',
  default: false,
});

// 
export const originIdState = atom({
  key: 'originIdState',
  default: null,
});


// used for sticky banner background color setting complementary color with image
export const backgroundColorState = atom({
  key: 'backgroundColorState',
  default: null,
});
export const randomColorColorState = atom({
  key: 'randomColorColorState',
  default: null,
});
