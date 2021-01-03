import React from 'react';

import cn from '@utils/classnames';

import './PickFont.css';
import { FieldSelect } from '@theme';

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
  titleClassName = '',
  title,
  settingsKey,
  value,
  setValue,
}: {
  className?: string;
  inputClassName?: string;
  titleClassName?: string;
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

  const fontOptions = React.useMemo(() => {
    const options = {
      [initialValue]: {
        name: initialValue,
      },
    };

    if (value !== initialValue && fontFamilies.length === 0) {
      options[value] = {
        name: value,
      };
    }

    fontFamilies.map(family => {
      options[family] = {
        name: family,
        style: { fontFamily: family },
      };
    });

    return options;
  }, [fontFamilies]);

  return (
    <div className={cn(className, 'pick-font')}>
      <p className={cn(titleClassName)}>{title}</p>
      <FieldSelect
        options={fontOptions}
        onChange={event => setValue((event.target as HTMLSelectElement).value)}
        value={value}
        name={settingsKey}
        id={settingsKey}
        onMouseDown={event => {
          if (fontFamilies.length === 0) {
            queryFonts().then(() => {
              (event.target as HTMLSelectElement).blur();
              // todo: rerendering the options does not update the options box height. Need to find a solution for that. issue #4
            });
          }
        }}
      />
    </div>
  );
};

export default PickFont;
