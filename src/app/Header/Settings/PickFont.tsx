import React from 'react';

import cn from '@utils/classnames';

import './PickFont.css';

const INITIAL_FONTS = {
  'font-editor-md': getComputedStyle(document.body).getPropertyValue(
    `--font-editor-md`
  ),
  'font-editor-wysiwyg': getComputedStyle(document.body).getPropertyValue(
    `--font-editor-wysiwyg`
  ),
};

const PickFont = ({
  className = '',
  inputClassName = '',
  title,
  settingsKey,
  value,
  setValue,
}: {
  className?: string;
  inputClassName?: string;
  title: string;
  settingsKey: string;
  value: string;
  setValue: Function;
}) => {
  const [fontFamilies, setFontFamilies] = React.useState<string[]>([]);
  const initialValue = React.useMemo(
    () => (INITIAL_FONTS[settingsKey] || '').replace(/"/g, ''),
    []
  );

  const queryFonts = async () => {
    // @ts-ignore
    const queriedFonts = navigator.fonts.query();
    const fonts = [];
    try {
      for await (const metadata of queriedFonts) {
        if (fonts.indexOf(metadata.family) === -1) {
          fonts.push(metadata.family);
        }
      }
    } catch (err) {
      console.error(err.name, err.message);
    }

    setFontFamilies(fonts);
  };

  return (
    <div className={cn(className, 'pick-font')}>
      <p className="pick-font__title">{title}</p>
      <select
        onMouseDown={event => {
          if (fontFamilies.length === 0) {
            queryFonts().then(() => {
              (event.target as HTMLSelectElement).blur();
              // todo: rerendering the options does not update the options box height. Need to find a solution for that. issue #4
            });
          }
        }}
        onChange={event => setValue((event.target as HTMLSelectElement).value)}
        value={value}
        name={settingsKey}
        id={settingsKey}
        className={cn(inputClassName, 'pick-font__select')}
      >
        <option value={initialValue}>{initialValue}</option>
        {fontFamilies.length === 0
          ? value &&
            value !== initialValue && <option value={value}>{value}</option>
          : fontFamilies.map((family, i) => (
              <option style={{ fontFamily: family }} value={family} key={i}>
                {family}
              </option>
            ))}
      </select>
    </div>
  );
};

export default PickFont;
