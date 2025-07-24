import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ProcessedField } from '@/types/form';

interface SelectFieldProps {
  field: ProcessedField;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SelectField({
  field,
  value,
  onChange,
  disabled = false,
}: SelectFieldProps) {
  const options = field.options || [];

  return (
    <Select value={value || ''} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className="w-full"
        aria-describedby={field.helpText ? `${field.name}-help` : undefined}
      >
        <SelectValue placeholder={field.placeholder || 'Select an option'} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
