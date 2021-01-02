import React from 'react';

import cn from '@utils/classnames';

import './PickFont.css';

const INITIAL_FONT_FAMILY = 'TEST';

const PickFont = ({
  className = '',
  title,
  key,
}: {
  className?: string;
  title: string;
  key: string;
}) => {
  const [font, setFont] = React.useState<string>(INITIAL_FONT_FAMILY);
  const [fontFamilies, setFontFamilies] = React.useState<string[]>([]);

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
        onClick={queryFonts}
        onChange={event =>
          console.log((event.target as HTMLSelectElement).value)
        }
      >
        {fontFamilies.length === 0 ? (
          <option>{font}</option>
        ) : (
          <React.Fragment>
            {fontFamilies.map(family => (
              <option selected={font === family} value={family}>
                {family}
              </option>
            ))}
          </React.Fragment>
        )}
      </select>
    </div>
  );
};

export default PickFont;
