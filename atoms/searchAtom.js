import { atom } from 'recoil';

export const searchResultState = atom({
  key: 'searchResultState',
  default: {},
});

export const queryState = atom({
  key: 'queryState',
  default: '',
});

export const querySubmittedState = atom({
  key: 'querySubmittedState',
  default: false,
});
