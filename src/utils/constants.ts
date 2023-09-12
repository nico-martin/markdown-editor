export const appTitle = '[md.edit]';
export const appDescription = '';
export const TINYMCE_URL = '/tinymce/tinymce.min.js';
export const MATOMO_SITE_ID: number = parseInt(
  import.meta.env.VITE_MATOMO_SITEID
);
export const MATOMO_URL = import.meta.env.VITE_MATOMO_URL || '';
export const MAX_OPEN_FILES: number = 6;

export const IS_DEV = import.meta.env.DEV;
