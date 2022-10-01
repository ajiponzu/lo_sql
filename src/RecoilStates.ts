import { atom } from "recoil";

export const reloadFlagState = atom({
  key: "reloadFlagState",
  default: false as boolean,
});

export const dbNameState = atom({
  key: "dbNameState",
  default: "" as string,
});

export const tableNameState = atom({
  key: "tableNameState",
  default: "goals" as string,
});

export const tableNamesState = atom({
  key: "tableNamesState",
  default: [] as Array<string>,
});

export const columnNamesState = atom({
  key: "columnNamesState",
  default: [] as Array<string>,
});
