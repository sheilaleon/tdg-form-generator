import { forwardRef } from 'react';

import { Input } from '../ui/input';

import { ProcessedField } from '@/types/form';

interface NumberFieldProps {
  field: ProcessedField;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
  disabled?: boolean;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ field, value, onChange, onBlur, disabled = false }, ref) => {
    return (
      <Input
        id={field.name}
        name={field.name}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(e) => {
          const val = e.target.value;

          // Only allow digits
          if (/^\d*$/.test(val)) {
            // Valid input, update state
            onChange(val === '' ? undefined : Number(val));
          } else {
            // Invalid input, do NOT update form state
            // This stops React from re-rendering with invalid value
          }
        }}
        onBlur={onBlur}
        ref={ref}
        placeholder={field.placeholder}
        className="w-full"
        aria-describedby={field.helpText ? `${field.name}-help` : undefined}
        disabled={disabled}
      />
    );
  },
);

NumberField.displayName = 'NumberField';
