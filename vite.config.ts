import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import fs from 'fs';
import postcssMixins from 'postcss-mixins';
import postcssNesting from 'postcss-nesting';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig } from 'vite';
import htmlPlugin from 'vite-plugin-html-config';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import app from './app.json';

dotenv.config();

const ORIGIN_TRIAL_TOKENS = [
  'Ah5u8QW8G3Py0j8j/29DK4WAdQpJtPJoQsvknC4MqgDItwciaP892EP4iEjejOh28DlQuUk5KgjB7IEUsuh4fQEAAABWeyJvcmlnaW4iOiJodHRwczovL2xvY2FsaG9zdDozMDAwIiwiZmVhdHVyZSI6IkZpbGVTeXN0ZW1PYnNlcnZlciIsImV4cGlyeSI6MTc0NzE4MDc5OX0=',
  'AgnPfbFuPAO/2caFKEdwd6c0LZ73yQ06kAci8DRgH4OrraCE3cMWeGC0UbC52PsUMK65oGAajpeBchEwgi10UgkAAABXeyJvcmlnaW4iOiJodHRwczovL21kLm5pY28uZGV2OjQ0MyIsImZlYXR1cmUiOiJGaWxlU3lzdGVtT2JzZXJ2ZXIiLCJleHBpcnkiOjE3NDcxODA3OTl9',
];

const icons = [
  ...app.iconSizes.map((size) => ({
    src: `fav/icon/pwa-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any',
  })),
  ...app.iconSizes.map((size) => ({
    src: `fav/icon/maskable-icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'maskable',
  })),
  {
    src: 'fav/icon/icon.svg',
    type: 'image/svg+xml',
    sizes: '512x512',
  },
  {
    src: 'fav/icon/favicon.ico',
    sizes: '72x72 96x96 128x128 256x256',
  },
];

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssMixins({
          mixinsDir: './src/styles/mixins',
        }),
        postcssNesting,
        autoprefixer,
        postcssPresetEnv,
      ],
    },
  },
  server: {
    https: {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
    },
    port: 3000,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      exportAsDefault: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest',
      workbox: {
        cleanupOutdatedCaches: false,
      },
      manifest: {
        name: app.title,
        short_name: app.short,
        description: app.description,
        theme_color: app.color,
        background_color: app.colorbkg,
        start_url: '/',
        scope: '/',
        id: '/',
        icons,
        file_handlers: [
          {
            action: '/',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
        screenshots: [
          {
            src: '/facebook.jpg',
            type: 'image/png',
            sizes: '1200x630',
          },
        ],
        shortcuts: [
          {
            name: 'Open New File',
            short_name: 'New File',
            description: 'Open an empty markdown file',
            url: '/#new-file',
            icons: app.iconSizes.map((size) => ({
              src: `fav/newFile/pwa-${size}x${size}.png`,
              sizes: `${size}x${size}`,
            })),
          },
        ],
      },
    }),
    htmlPlugin({
      title: app.title,
      metas: [
        {
          name: 'description',
          content: app.description,
        },
        {
          name: 'og:image',
          content: '/facebook.jpg',
        },
        {
          name: 'og:title',
          content: app.title,
        },
        {
          name: 'og:description',
          content: app.description,
        },
        {
          name: 'og:locale',
          content: 'en_US',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:creator',
          content: '@nic_o_martin',
        },
        {
          name: 'twitter:title',
          content: app.title,
        },
        {
          name: 'twitter:description',
          content: app.description,
        },
        {
          name: 'twitter:image',
          content: '/twitter.jpg',
        },
        ...ORIGIN_TRIAL_TOKENS.map((token) => ({
          name: 'trial_tokens',
          content: token,
        })),
      ],
    }),
  ],
});
