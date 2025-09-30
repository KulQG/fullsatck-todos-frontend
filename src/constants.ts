export enum TABS {
  ALL = "Все",
  DONE = "Выполненные",
  UNDONE = "Невыполненные",
}

export const ALL_TABS = [TABS.ALL, TABS.DONE, TABS.UNDONE];

export const TABS_SELECT_OPTIONS = (Object.values(TABS) as TABS[]).map((tab) => ({
  label: tab,
  value: tab,
}));
