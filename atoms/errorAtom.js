import { atom } from 'recoil';

// used to set whether to show an error message in the serach field when there error fetching search results
export const errorState = atom({
  key: 'errorState',
  default: false,
});
