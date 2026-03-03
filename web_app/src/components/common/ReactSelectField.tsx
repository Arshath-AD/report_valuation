import React, { useMemo } from 'react';
import Select, {
  MultiValue,
  SingleValue,
  StylesConfig,
  GroupBase,
} from 'react-select';

export type Option = {
  label: string;
  value: string;
};

interface ReactSelectFieldProps {
  options: Option[];
  value: Option | Option[] | null;
  onChange: (value: Option | Option[] | null) => void;
  isMulti?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
  /** Left padding for the value container — use when an icon is overlaid on the left */
  iconPadding?: string | number;
}

export const ReactSelectField: React.FC<ReactSelectFieldProps> = ({
  options,
  value,
  onChange,
  isMulti = false,
  placeholder = 'Select...',
  isLoading = false,
  isClearable = true,
  isDisabled = false,
  className,
  iconPadding,
}) => {
  const handleChange = (
    selected: MultiValue<Option> | SingleValue<Option>
  ): void => {
    if (isMulti) {
      onChange(selected as Option[]);
    } else {
      onChange(selected as Option | null);
    }
  };

  console.log(options);

  const customStyles: StylesConfig<Option, boolean, GroupBase<Option>> = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: '48px',
        borderRadius: '12px',
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
        borderColor: state.isFocused ? '#8b5cf6' : 'rgba(51, 65, 85, 0.5)', // brand-500 : slate-700/50
        boxShadow: state.isFocused ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#8b5cf6', // brand-500
        },
      }),
      valueContainer: (base) => ({
        ...base,
        ...(iconPadding !== undefined ? { paddingLeft: iconPadding } : {}),
      }),
      menu: (base) => ({
        ...base,
        borderRadius: '12px',
        overflow: 'hidden',
        zIndex: 50,
        backgroundColor: '#0f172a', // slate-900
        border: '1px solid rgba(51, 65, 85, 0.5)', // slate-700/50
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? 'rgba(139, 92, 246, 0.2)' // brand-500/20
          : state.isFocused
            ? 'rgba(30, 41, 59, 0.8)' // slate-800/80
            : 'transparent',
        color: state.isSelected ? '#a78bfa' : '#cbd5e1', // brand-400 : slate-300
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '8px',
      }),
      multiValueLabel: (base) => ({
        ...base,
        padding: '4px 8px',
        color: '#f8fafc', // slate-50
      }),
      multiValueRemove: (base) => ({
        ...base,
        borderRadius: '0 8px 8px 0',
        color: '#94a3b8', // slate-400
        '&:hover': {
          backgroundColor: 'rgba(239, 68, 68, 0.2)', // red-500/20
          color: '#ef4444', // red-500
        },
      }),
      placeholder: (base) => ({
        ...base,
        color: '#64748b', // slate-500
      }),
      indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
      }),
      // Add this to style the input container
      input: (base) => ({
        ...base,
        color: '#f8fafc', // text-white
        '& input': {
          boxShadow: 'none !important',
          outline: 'none !important',
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: '#f8fafc', // text-white
      }),
      dropdownIndicator: (base) => ({
        ...base,
        color: '#64748b', // slate-500
        '&:hover': {
          color: '#94a3b8', // slate-400
        }
      }),
      clearIndicator: (base) => ({
        ...base,
        color: '#64748b', // slate-500
        '&:hover': {
          color: '#ef4444', // red-500
        }
      }),
    }),
    []
  );

  return (
    <Select<Option, boolean>
      options={options}
      value={value}
      onChange={handleChange}
      isMulti={isMulti}
      isLoading={isLoading}
      isClearable={isClearable}
      isDisabled={isDisabled}
      placeholder={placeholder}
      styles={customStyles}
      className={className}
      // Change this to remove the default class names
      classNamePrefix="custom-select" // Change from "react-select" to something else
      // OR remove it completely by setting it to undefined
      // classNamePrefix={undefined}
      unstyled={false}
    />
  );
};