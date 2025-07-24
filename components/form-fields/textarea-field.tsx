import { forwardRef } from 'react';

import { Textarea } from '../ui/textarea';

import { ProcessedField } from '@/types/form';

interface TextareaFieldProps {
  field: ProcessedField;
  value: string;
  onChange: (value: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  disabled?: boolean;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ field, value, onChange, onBlur, disabled = false }, ref) => {
  return (
    <Textarea
      id={field.name}
      name={field.name}
      value={value ?? ''}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      placeholder={field.placeholder}
      className="min-h-[70px] w-full"
      aria-describedby={field.helpText ? `${field.name}-help` : undefined}
      disabled={disabled}
    />
  );
});

TextareaField.displayName = 'TextareaField';
