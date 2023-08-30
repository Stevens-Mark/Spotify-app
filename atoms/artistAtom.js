import { atom } from 'recoil';

// list of tracks in artist
export const artistTrackListState = atom({
  key: 'artistTrackListState',
  default: [],
});

// list of track uris for top 10 artist tracks
export const artistTrackUrisState = atom({
  key: 'artistTrackUrisState',
  default: [],
});

// track whether track being played is from the artist top 10 list 
// (control how skip forward/back controls assigns setCurrentItemId or not to avoid loosing focus on artist card)
export const activeArtistState = atom({
  key: 'activeArtistState',
  default: false,
});

// stores artists discography (SSR server side rendering) - on discography page
export const discographyState = atom({
  key: 'discographyState',
  default: [],
});

// stores shorter list of artists albums/singles from discography (CSR) - client side rendering
export const artistsDiscographyState = atom({
  key: 'artistsDiscographyShortState',
  default: [],
});

// stores albums only from artist discography
export const albumsDiscographyState = atom({
  key: 'albumsDiscographyState',
  default: [],
});

// strores singles only from artist discography
export const singlesDiscographyState = atom({
  key: 'singlesDiscographyState',
  default: [],
});

// show all, singles or albums only from artists discography
export const discographyToShowState = atom({
  key: 'discographyToShowState',
  default: 'all',
});

// toggle between list/card view on discography page
export const viewState = atom({
  key: 'viewState',
  default: true,
});

// last artist discography loaded Id
export const lastArtistIdState = atom({
  key: 'lastArtistIdState',
  default: null,
});