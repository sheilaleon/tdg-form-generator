import { Input } from '@/components/ui/input';

import { ProcessedField } from '@/types/form';

interface TextFieldProps {
  field: ProcessedField;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
}

export function TextField({
  field,
  value,
  onChange,
  onBlur,
  disabled = false,
}: TextFieldProps) {
  return (
    <Input
      id={field.name}
      name={field.name}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder}
      aria-describedby={field.helpText ? `${field.name}-help` : undefined}
      disabled={disabled}
    />
  );
}
