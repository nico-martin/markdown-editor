import { FieldSelect } from '@theme';
import React from 'react';

import cn from '@utils/classnames';

import { useFontAccessContext } from '@store/FontAccessContext.tsx';

import styles from './PickFont.module.css';

const getInitialFont: () => Record<string, string> = () => ({
  'font-editor-md': getComputedStyle(document.body).getPropertyValue(
    `--font-editor-md`
  ),
  'font-editor-wysiwyg': getComputedStyle(document.body).getPropertyValue(
    `--font-editor-wysiwyg`
  ),
});

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
  const initialValue = React.useMemo(() => {
    const initialFont = getInitialFont();
    return (settingsKey in initialFont ? initialFont[settingsKey] : '')
      .replace(/"/g, '')
      .replace(/'/g, '');
  }, []);
  const { fontFamilies } = useFontAccessContext();

  const fontOptions: Array<{ value: string; label: string }> = React.useMemo(
    () =>
      fontFamilies.map((family) => ({
        value: family,
        label: family,
      })),
    [fontFamilies, initialValue]
  );

  return (
    <div className={cn(className, styles.root)}>
      <p className={cn(titleClassName)}>{title}</p>
      <FieldSelect
        options={fontOptions}
        onChange={(value) => setValue(value)}
        value={value}
        name={settingsKey}
        id={settingsKey}
        fontStyling
      />
    </div>
  );
};

export default PickFont;
