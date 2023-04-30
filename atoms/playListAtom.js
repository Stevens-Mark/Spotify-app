import { atom } from "recoil";

export const playListIdState = atom({
  key: "playListIdState",
  // default: "1beJKiTTWHdetZqGFyBeAN",
  default: null
});

export const playListState = atom({
  key: "playListState",
  default: null,
});

export const currentPlaylistIdState = atom({
  key: "currentPlaylistIdState",
  default: null,
});