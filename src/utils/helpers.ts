export const isDev: boolean = IS_DEV;

export const featureCheck: boolean =
  'showOpenFilePicker' in window &&
  'showSaveFilePicker' in window &&
  'showDirectoryPicker' in window;

export const fontAccessAPI: boolean = 'queryLocalFonts' in window;
