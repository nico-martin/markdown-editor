/*
export const featureCheck: boolean =
  'showOpenFilePicker' in window &&
  'showSaveFilePicker' in window &&
  'showDirectoryPicker' in window;

export const fontAccessAPI: boolean = 'queryLocalFonts' in window;
*/

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getFirstXChars = (str: string, x: number): string => {
  return str.slice(0, x);
};

export const removeBracketsAndWordsInside = (str: string): string => {
  return str.replace(/ *\([^)]*\) */g, '');
};

export const getLastElementOfPath = (path: string): string => {
  return path.split('/').pop();
};
