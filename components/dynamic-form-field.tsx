import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { UseFormReturn } from 'react-hook-form';

import { ProcessedField } from '@/types/form';

interface DynamicFormFieldProps {
  field: ProcessedField;
  form: UseFormReturn<any>;
  mainFieldName?: string;
}

export function DynamicFormField({
  field,
  form,
  mainFieldName,
}: DynamicFormFieldProps) {
  const mainFieldValue = mainFieldName ? form.watch(mainFieldName) : null;
  const shouldShowPhotoField =
    !mainFieldName ||
    (mainFieldValue !== null &&
      mainFieldValue !== undefined &&
      mainFieldValue !== '');

  // If this is a photo field and the main field has no value, don't render
  if (field.type === 'photo' && !shouldShowPhotoField) return null;

  console.log(`field :>>`, field);

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            {field.label}
            {!field.required && field.type !== 'photo' && (
              <span className="text-muted-foreground">(optional)</span>
            )}
          </FormLabel>
          <FormControl>
            {(() => {
              switch (field.type) {
                case 'text':
                  return (
                    <Input
                      id={field.name}
                      name={formField.name}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      placeholder={field.placeholder}
                    />
                  );
              }
            })()}
          </FormControl>
          {field.helpText && (
            <FormDescription
              id={`${field.name}-help`}
              className="text-sm text-gray-600"
            >
              {field.helpText}
            </FormDescription>
          )}

          <FormMessage className="text-sm text-red-600" />
        </FormItem>
      )}
    />
  );
}
