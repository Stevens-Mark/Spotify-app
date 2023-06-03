import { atom } from 'recoil';

export const queryState = atom({
  key: 'queryState',
  default: '',
});

export const querySubmittedState = atom({
  key: 'querySubmittedState',
  default: false,
});

export const searchingState = atom({
  key: 'searchingState',
  default: '',
});

export const searchResultState = atom({
  key: 'searchResultState',
  default: {},
});

export const topResultState = atom({
  key: 'topResultState',
  default: {},
});