export const SCREENS = {
  HOME: 'Home',
  TASK_DETAILS: 'TaskDetails',
  SETTINGS: 'Settings',
  ABOUT: 'About',
} as const;

export type ScreenNames = typeof SCREENS[keyof typeof SCREENS];
