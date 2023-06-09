import { atom } from 'recoil';

// holds list of genres for building genre section on search page
export const genreState = atom({
  key: 'genreState',
  default: null,
});
