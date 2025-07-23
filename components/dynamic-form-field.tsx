import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
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
                case 'textarea':
                  return (
                    <Textarea
                      id={field.name}
                      name={formField.name}
                      value={(formField.value as string) ?? ''}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                      placeholder={field.placeholder}
                      className="min-h-[100px] w-full"
                      aria-describedby={
                        field.helpText ? `${field.name}-help` : undefined
                      }
                    />
                  );
                case 'number':
                  return (
                    <Input
                      id={field.name}
                      name={formField.name}
                      type="number"
                      value={
                        formField.value === undefined ||
                        formField.value === null
                          ? ''
                          : formField.value
                      }
                      onChange={(e) =>
                        formField.onChange(
                          e.target.value === ''
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                      placeholder={field.placeholder}
                      className="w-full"
                      aria-describedby={
                        field.helpText ? `${field.name}-help` : undefined
                      }
                    />
                  );
                case 'select':
                  const options = field.options || [];
                  return (
                    <Select
                      value={formField.value?.toString() || ''}
                      onValueChange={(value) => formField.onChange(value)}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-describedby={
                          field.helpText ? `${field.name}-help` : undefined
                        }
                      >
                        <SelectValue
                          placeholder={field.placeholder || 'Select an option'}
                        />
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
