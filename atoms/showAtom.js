import { atom } from 'recoil';

// list of episodes in show
export const showEpisodesListState = atom({
  key: 'showEpisodesListState',
  default: null,
});

// list of track uris for episodes in show
export const showEpisodesUrisState = atom({
  key: 'showEpisodesUrisState',
  default: null,
});