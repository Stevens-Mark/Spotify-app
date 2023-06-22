import { atom } from 'recoil';

// current showEpisode Id
export const showEpisodeIdState = atom({
  key: 'showEpisodeIdState',
  default: null,
});
// list of episodes in show
export const showEpisodesListState = atom({
  key: 'showEpisodesListState',
  default: [],
});

// list of track uris for episodes in show
export const showEpisodesUrisState = atom({
  key: 'showEpisodesUrisState',
  default: [],
});