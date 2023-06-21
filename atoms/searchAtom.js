import { atom } from 'recoil';

// the user's query string entered
export const queryState = atom({
  key: 'queryState',
  default: '',
});

// indicates if a valid search query has been submitted? helps control wether search navigation bar is diplayed
export const querySubmittedState = atom({
  key: 'querySubmittedState',
  default: false,
});

// used to trigger whether to show a loading icon or not durring searching
export const searchingState = atom({
  key: 'searchingState',
  default: '',
});

// holds the results from a query (albums, playlists, artists etc)
export const searchResultState = atom({
  key: 'searchResultState',
  default: {},
});

// holds the "top results"
export const topResultState = atom({
  key: 'topResultState',
  default: {},
});
