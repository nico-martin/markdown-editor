import { FieldSelect } from '@theme';
import React from 'react';

import cn from '@utils/classnames';

import { useFontAccessContext } from '@store/FontAccessContext.tsx';

import styles from './PickFont.module.css';

const INITIAL_FONTS: Record<string, string> = {
  'font-editor-md': getComputedStyle(document.body).getPropertyValue(
    `--font-editor-md`
  ),
  'font-editor-wysiwyg': getComputedStyle(document.body).getPropertyValue(
    `--font-editor-wysiwyg`
  ),
};

const PickFont = ({
  className = '',
  titleClassName = '',
  title,
  settingsKey,
  value,
  setValue,
}: {
  className?: string;
  titleClassName?: string;
  title: string;
  settingsKey: string;
  value: string;
  setValue: (value: string) => void;
}) => {
  const initialValue = React.useMemo(
    () =>
      (settingsKey in INITIAL_FONTS ? INITIAL_FONTS[settingsKey] : '').replace(
        /"/g,
        ''
      ),
    []
  );
  const { fontFamilies, queryFonts } = useFontAccessContext();

  const fontOptions: Record<
    string,
    { name: string; style: React.CSSProperties }
  > = React.useMemo(() => {
    const options = {
      [initialValue]: {
        name: initialValue.split(',')[0],
        style: { fontFamily: 'auto' },
      },
    };

    if (value !== initialValue && fontFamilies.length === 0) {
      options[value] = {
        name: value,
        style: { fontFamily: value },
      };
    }

    fontFamilies.map((family) => {
      options[family] = {
        name: family,
        style: { fontFamily: family },
      };
    });

    return options;
  }, [fontFamilies]);

  return (
    <div className={cn(className, styles.root)}>
      <p className={cn(titleClassName)}>{title}</p>
      <FieldSelect
        options={fontOptions}
        onChange={(event) =>
          setValue((event.target as HTMLSelectElement).value)
        }
        value={value}
        name={settingsKey}
        id={settingsKey}
        onMouseDown={() => fontFamilies.length === 0 && queryFonts()}
      />
    </div>
  );
};

export default PickFont;
