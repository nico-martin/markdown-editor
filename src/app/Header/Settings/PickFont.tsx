import React from 'react';
import { Provider, useActions, useStoreState } from 'unistore-hooks';
import { actions, defaultFile, store } from '@store/index';

import cn from '@utils/classnames';

import './PickFont.css';
import { FieldSelect } from '@theme';
import { State } from '@store/types';

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
  const { setFontFamilies } = useActions(actions);
  const { fontFamilies } = useStoreState<State>(['fontFamilies']);
  const initialValue = React.useMemo(
    () => (INITIAL_FONTS[settingsKey] || '').replace(/"/g, ''),
    []
  );

  const queryFonts = async () => {
    // @ts-ignore
    navigator.fonts.query().then(queriedFonts => {
      setFontFamilies(
        queriedFonts.reduce(
          (acc, font) =>
            acc.indexOf(font.family) === -1 ? [...acc, font.family] : acc,
          []
        )
      );
    });
  };

  const fontOptions = React.useMemo(() => {
    const options = {
      [initialValue]: {
        name: initialValue,
        style: { fontFamily: 'auto' },
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
        onMouseDown={() => fontFamilies.length === 0 && queryFonts()}
      />
    </div>
  );
};

export default PickFont;
