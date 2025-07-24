import { format } from 'date-fns';

import { Input } from '@/components/ui/input';

import { ProcessedField } from '@/types/form';

interface DateTimeFieldProps {
  field: ProcessedField;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  disabled?: boolean;
}

export function DateTimeField({
  field,
  value,
  onChange,
  onBlur,
  disabled = false,
}: DateTimeFieldProps) {
  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <Input
      type="datetime-local"
      id={field.name}
      name={field.name}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.placeholder}
      max={now}
      aria-describedby={field.helpText ? `${field.name}-help` : undefined}
      disabled={disabled}
    />
  );
}
