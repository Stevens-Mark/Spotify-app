import { atom } from 'recoil';

export const searchResultState = atom({
  key: 'searchResultState',
  default: [],
});

export const queryState = atom({
  key: 'queryState',
  default: '',
});
