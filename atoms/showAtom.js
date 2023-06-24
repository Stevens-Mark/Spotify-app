import { atom } from 'recoil';

// XXXXXXXXXX EPISODES IN A SHOW XXXXXXXXXX

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

// XXXXXXXXXX EPISODES XXXXXXXXXX

// list of episodes
export const episodesListState = atom({
  key: 'episodesListState',
  default: [],
});

// list of track uris for episodes
export const episodesUrisState = atom({
  key: 'episodesUrisState',
  default: [],
});
