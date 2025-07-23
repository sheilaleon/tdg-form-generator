import { UseFormReturn } from 'react-hook-form';

import { ProcessedField } from '@/types/form';

interface DynamicFormFieldProps {
  field: ProcessedField;
  form: UseFormReturn<any>;
}

export function DynamicFormField({ field, form }: DynamicFormFieldProps) {
  return <div>{field.label}</div>;
}
