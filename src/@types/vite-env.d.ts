/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TINYMCE_KEY: string;
  readonly VITE_MATOMO_SITEID: string;
  readonly VITE_MATOMO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
