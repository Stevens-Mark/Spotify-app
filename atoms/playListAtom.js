import { atom } from "recoil";

export const playlistIdState = atom({
  key: "playlistIdState",
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null
});

export const playlistState = atom({
  key: "playlistState",
  default: null,
});

// export const currentplaylistIdState = atom({
//   key: "currentplaylistIdState",
//   default: null,
// });