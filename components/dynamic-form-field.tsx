import { CheckboxField } from './form-fields/checkbox-field';
import { DateTimeField } from './form-fields/datetime-field';
import { NumberField } from './form-fields/number-field';
import { PhotoField } from './form-fields/photo-field';
import { SelectField } from './form-fields/select-field';
import { TextField } from './form-fields/text-field';
import { TextareaField } from './form-fields/textarea-field';
import { UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { ProcessedField } from '@/types/form';

interface DynamicFormFieldProps {
  field: ProcessedField;
  form: UseFormReturn<any>;
  mainFieldName?: string;
  onReset?: () => void;
  disabled?: boolean;
}

export function DynamicFormField({
  field,
  form,
  disabled = false,
  mainFieldName,
  onReset,
}: DynamicFormFieldProps) {
  const mainFieldValue = mainFieldName ? form.watch(mainFieldName) : null;
  const shouldShowPhotoField =
    !mainFieldName ||
    (mainFieldValue !== null &&
      mainFieldValue !== undefined &&
      mainFieldValue !== '');

  // Check if this is a main photo field (not part of a fieldset)
  const isMainPhotoField = field.type === 'photo' && !mainFieldName;

  // If this is a photo field and the main field has no value, don't render
  if (field.type === 'photo' && !shouldShowPhotoField) return null;

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
                    <TextField
                      field={field}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      disabled={disabled}
                    />
                  );
                case 'textarea':
                  return (
                    <TextareaField
                      field={field}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                      disabled={disabled}
                    />
                  );
                case 'number':
                  return (
                    <NumberField
                      field={field}
                      value={formField.value}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                      disabled={disabled}
                    />
                  );
                case 'select':
                  return (
                    <SelectField
                      field={field}
                      value={formField.value?.toString() || ''}
                      onChange={formField.onChange}
                      disabled={disabled}
                      isNative={true}
                    />
                  );
                case 'photo':
                // TODO create a separate component for generic document uploads
                case 'file':
                  return (
                    <PhotoField
                      field={field}
                      form={form}
                      onChange={formField.onChange}
                      isMainPhotoField={isMainPhotoField}
                      disabled={disabled}
                      onReset={onReset}
                    />
                  );
                case 'datetime':
                  return (
                    <DateTimeField
                      field={field}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      disabled={disabled}
                    />
                  );

                case 'checkbox':
                  return (
                    <CheckboxField
                      field={field}
                      checked={formField.value || false}
                      onChange={formField.onChange}
                      disabled={disabled}
                    />
                  );

                default:
                  return null;
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
