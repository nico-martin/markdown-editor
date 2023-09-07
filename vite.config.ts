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

const icons = [
  ...app.iconSizes.map((size) => ({
    src: `pwa-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any',
  })),
  ...app.iconSizes.map((size) => ({
    src: `maskable-icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'maskable',
  })),
  {
    src: 'icon.svg',
    type: 'image/svg+xml',
    sizes: '512x512',
  },
  {
    src: 'favicon.ico',
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
        icons,
        file_handlers: [
          {
            action: '/',
            accept: {
              'text/markdown': ['.md'],
            },
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
          content: 'en_US',
        },
        {
          name: 'twitter:type',
          content: '/twitter.jpg',
        },
      ],
    }),
  ],
});
