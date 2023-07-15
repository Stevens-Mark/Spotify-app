import { atom } from 'recoil';

// holds list of genre names for building genre section on search page
export const genreState = atom({
  key: 'genreState',
  default: null,
});

export const genreListState = atom({
  key: 'genreListState',
  default: [],
});