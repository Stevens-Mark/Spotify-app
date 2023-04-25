import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState", // Unique ID (with respect to other atoms/selectors)
  default: null,              // initial state
});

export const isPlayState = atom({
  key: "isPlayState",
  default: false,
});