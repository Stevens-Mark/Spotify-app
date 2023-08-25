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

export const artistsDiscographyState = atom({
  key: 'artistsDiscographyState',
  default: [],
});