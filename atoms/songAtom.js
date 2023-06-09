import { atom } from 'recoil';

// export const State = atom({
//   key: 'State', // Unique ID (with respect to other atoms/selectors)
//   default: null, // initial state
// });

// track whether a track/song is playing or not
export const isPlayState = atom({
  key: 'isPlayState',
  default: false,
});

// track where in playlist/album a song is playing (ie, order/index) helps for equaliser position etc...
export const currentSongIndexState = atom({
  key: 'currentSongIndexState',
  default: null,
});

// track the currently playing ID.  triggers the player to update the information (bottom left)
export const currentTrackIdState = atom({
  key: 'currentTrackIdState',
  default: null,
});
