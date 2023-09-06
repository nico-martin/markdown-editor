const fs = require('fs');
const path = require('path');

const svgFolderPath = './icons';
const outputFilePath = './icons.ts';

const toCamelCase = (str) =>
  str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

fs.readdir(svgFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading SVG folder:', err);
    return;
  }

  const importStatements = [];
  const iconsObject = {};

  files.forEach((file) => {
    if (file.endsWith('.svg')) {
      const iconName = toCamelCase(path.basename(file, '.svg'));
      importStatements.push(
        `import ${iconName} from '${svgFolderPath}/${file}';`
      );
      iconsObject[path.basename(file, '.svg')] = iconName;
    }
  });

  const iconsContent = Object.keys(iconsObject)
    .map((key) => `  '${key}': ${iconsObject[key]}`)
    .join(',\n');

  const contents = [
    '/* This file was generated automatically with the ./generate.js script */',
    importStatements.join('\n'),
    `const icons = {\n${iconsContent}\n};`,
    'export type IconType = keyof typeof icons;',
    'export default icons;',
  ];

  fs.writeFile(outputFilePath, contents.join('\n\n'), (writeErr) => {
    if (writeErr) {
      console.error('Error writing icons.ts:', writeErr);
      return;
    }
    console.log('icons.ts file generated successfully!');
  });
});
