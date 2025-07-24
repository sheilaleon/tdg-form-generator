import { Checkbox } from '../ui/checkbox';

import { ProcessedField } from '@/types/form';

interface CheckboxFieldProps {
  field: ProcessedField;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxField({
  field,
  checked,
  onChange,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.name}
        checked={checked || false}
        onCheckedChange={onChange}
        aria-describedby={field.helpText ? `${field.name}-help` : undefined}
        disabled={disabled}
      />
      <label
        htmlFor={field.name}
        className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          disabled ? 'text-gray-400' : ''
        }`}
      >
        Yes
      </label>
    </div>
  );
}
