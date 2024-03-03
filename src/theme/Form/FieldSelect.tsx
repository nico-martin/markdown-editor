import React from 'react';
import Select from 'react-select';
import {
  Group,
  Option,
  OptionsOrGroups, // @ts-ignore
} from 'react-select/dist/declarations/src/types';

import cn from '@utils/classnames';

import styles from './FieldSelect.module.css';

const FieldSelect: React.FC<{
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  name: string;
  id: string;
  options: OptionsOrGroups<Option, Group>;
  fontStyling?: boolean;
  onBlur?: () => void;
  [key: string]: any;
}> = ({
  className = '',
  value,
  onChange,
  name,
  id,
  options,
  fontStyling = false,
  ...rest
}) => {
  delete rest.onBlur;
  const allOptions = React.useMemo(
    () =>
      options
        .map((option: Option | Group) =>
          option.options
            ? option.options.map((option: Option) => option)
            : option
        )
        .flat(),
    [options]
  );

  return (
    <Select
      options={options}
      onChange={(newValue: { value: string; label: string }) => {
        onChange(newValue.value);
      }}
      value={
        allOptions.find(
          (option: { value: string; label: string }) => option.value === value
        ) || null
      }
      id={id}
      className={cn(className, styles.root)}
      name={name}
      styles={{
        option: (provided, state) => ({
          ...provided,
          // @ts-ignore
          ...(fontStyling ? { fontFamily: state?.value || '' } : {}),
        }),
      }}
      classNames={{
        control: () => styles.control,
        menu: () => styles.menu,
        menuList: () => styles.menuList,
        input: () => styles.input,
        singleValue: () => styles.singleValue,
        option: (state) =>
          state.isFocused ? styles.optionFocus : styles.option,
        dropdownIndicator: (state) =>
          state.isFocused
            ? styles.dropdownIndicatorFocus
            : styles.dropdownIndicator,
      }}
      {...rest}
    />
  );
};

export default FieldSelect;
