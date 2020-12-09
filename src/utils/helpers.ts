export const isDev: boolean = IS_DEV;

export const windowResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export const untrailingSlashIt = (str: string): string =>
  str.replace(/\/$/, '');

export const trailingSlashIt = (str: string): string =>
  untrailingSlashIt(str) + '/';
