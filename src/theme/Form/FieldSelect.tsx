import React, { ChangeEventHandler } from 'react';
import Select from 'react-select';
import {
  Group,
  Option,
  OptionsOrGroups,
} from 'react-select/dist/declarations/src/types';

import cn from '@utils/classnames';

import styles from './FieldSelect.module.css';

const FieldSelect: React.FC<{
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  name: string;
  id: string;
  //options: Record<string, { name: string; style: React.CSSProperties }>;
  options: OptionsOrGroups<Option, Group>;
  onMouseDown?: React.MouseEventHandler<HTMLSelectElement>;
}> = ({
  className = '',
  value,
  onChange,
  name,
  id,
  options,
  onMouseDown = null,
}) => {
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
      classNames={{
        control: () => styles.control,
        menu: () => styles.menu,
        menuList: () => styles.menuList,
      }}
      //menuIsOpen
    />
  );
};

export default FieldSelect;
