import { atom } from "recoil";

export const currentItemState = atom({
  key: 'currentItemState',
  default: null,
});

export const currentItemIdState = atom({
  key: 'currentPlaylistIdState',
  default: null,
});

// export const currentArtistIdState = atom({
//   key: 'currentArtistIdState',
//   default: null,
// });


// export const currentAlbumIdState = atom({
//   key: 'currentAlbumIdState',
//   default: null,
// });