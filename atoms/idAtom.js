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