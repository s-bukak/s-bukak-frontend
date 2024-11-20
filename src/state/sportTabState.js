import { atom } from "recoil";

export const activeSportTabState = atom({
  key: "activeSportTabState",
  default: "soccer",
});

export const teamIdState = atom({
  key: "teamIdState",
  default: 1,
});
