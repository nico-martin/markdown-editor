# [md.edit]

[md.edit] is a web based markdown editor that uses modern progressive web app features to provide a great, cross-platform editing experience.

[md.nico.dev](https://md.nico.dev)

## File System Access API

The main goal of this project is to showcase the **[File System Access API](https://wicg.github.io/file-system-access/)**.

This API allows a web app to access local files. That means files can be opened and saved directly in the browser.  

[https://web.dev/file-system-access/](https://web.dev/file-system-access/)

## Progressive Web App

The app can be added to the homescreen using a WebAppManifest (via the [WebpackPwaManifest](https://github.com/nico-martin/markdown-editor/blob/main/webpack.config.babel.js#L88-L114) plugin) and also works offline using [WorkboxJS](https://developers.google.com/web/tools/workbox).

It uses [PreactJS](https://preactjs.com/) and [unistore](https://github.com/developit/unistore) together with [PostCSS](https://postcss.org/), all bundled using [Webpack](https://webpack.js.org/).