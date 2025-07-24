import { useEffect } from 'react';

import { DynamicFormField } from './dynamic-form-field';
import { Card, CardContent } from './ui/card';
import { Form } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { fileToDataUrl } from '@/lib/file-to-data-url';
import { createFormSchema } from '@/lib/form-validation';
import { cn } from '@/lib/utils';

import { ProcessedForm } from '@/types/form';

interface FormRendererProps {
  spec: ProcessedForm;
  onSubmit: (data: any) => void;
  onReset: () => void;
}

export function FormRenderer({ spec, onSubmit, onReset }: FormRendererProps) {
  const schema = createFormSchema(spec);

  // Create default values from the spec
  const defaultValues = spec.fields.reduce(
    (acc, field) => {
      if ('defaultValue' in field) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
    shouldFocusError: false, // Disable React Hook Form's auto-focus
  });

  // Scroll to first validation error
  useEffect(() => {
    const firstError = Object.keys(form.formState.errors)[0];
    if (firstError) {
      // Try to find the element by field name first
      let errorElement = document.getElementById(firstError);

      // If not found, try the upload variant for file/photo fields
      if (!errorElement) {
        errorElement = document.getElementById(`${firstError}-upload`);
      }

      // For file/photo fields, find the visible button instead of the hidden input
      if (errorElement && errorElement.classList.contains('hidden')) {
        const parentDiv = errorElement.parentElement;
        const visibleButton = parentDiv?.querySelector(
          'button[type="button"]',
        ) as HTMLElement;
        if (visibleButton) {
          errorElement = visibleButton;
        }
      }

      if (errorElement) {
        // Scroll to the element with some offset for better visibility
        const elementRect = errorElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - window.innerHeight / 2;

        window.scrollTo({
          top: middle,
          behavior: 'smooth',
        });

        // Focus the element for better accessibility
        // Only focus if the element is focusable (not hidden)
        setTimeout(() => {
          if (errorElement && !errorElement.classList.contains('hidden')) {
            errorElement.focus({ preventScroll: true });
          }
        }, 500); // Wait for scroll animation to complete
      }
    }
  }, [form.formState.errors]);

  // Group fields by their group property
  const groupedFields = spec.fields.reduce(
    (groups, field) => {
      const group = field.group || 'default';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(field);
      return groups;
    },
    {} as Record<string, typeof spec.fields>,
  );

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (data: any) => {
    try {
      // Mock delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const processedData = { ...data };

      for (const [key, value] of Object.entries(processedData)) {
        if (value instanceof File) {
          // Single file
          processedData[key] = {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: new Date(value.lastModified).toISOString(),
            dataUrl: await fileToDataUrl(value),
          };
        } else if (
          Array.isArray(value) &&
          value.length > 0 &&
          value[0] instanceof File
        ) {
          // Array of files
          processedData[key] = await Promise.all(
            value.map(async (file: File) => ({
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: new Date(file.lastModified).toISOString(),
              dataUrl: await fileToDataUrl(file),
            })),
          );
        }
      }

      onSubmit(processedData);
      form.reset(defaultValues);
    } catch (error) {
      console.error('Error processing form submission:', error);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    onReset();

    // Reset scroll position to top of the page after DOM updates
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  };

  const renderField = (field: any, index: number, fields: any[]) => {
    const key = field.name;
    const gridClass =
      field.fullWidth ||
      field.type === 'photo' ||
      field.type === 'file' ||
      field.type === 'textarea'
        ? 'md:col-span-2'
        : 'col-span-1 lol';

    if (field.isFieldsetStart) {
      // Find the related fields in this fieldset
      const fieldsetFields = [field];
      let commentField = null;
      let photoField = null;

      // Look ahead to find comment and photo fields
      for (let i = index + 1; i < fields.length; i++) {
        const nextField = fields[i];
        if (nextField.isFieldsetMember || nextField.isFieldsetEnd) {
          fieldsetFields.push(nextField);
          if (nextField.type === 'textarea') {
            commentField = nextField;
          }
          if (nextField.type === 'photo') {
            photoField = nextField;
          }
          if (nextField.isFieldsetEnd) break;
        } else {
          break;
        }
      }

      return (
        <fieldset
          key={key}
          className={cn(
            isSubmitting && 'pointer-events-none opacity-50',
            'space-y-4 rounded-lg py-4 md:col-span-2',
          )}
        >
          <legend className="sr-only">{field.fieldsetTitle}</legend>

          {/* Main field and photo side by side */}
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <DynamicFormField
                field={field}
                form={form}
                disabled={isSubmitting}
              />
            </div>

            {photoField && (
              <DynamicFormField
                field={photoField}
                form={form}
                mainFieldName={field.name}
                disabled={isSubmitting}
              />
            )}
          </div>

          {/* Comment field underneath both */}
          {commentField && (
            <div className="mt-4">
              <DynamicFormField
                field={commentField}
                form={form}
                disabled={isSubmitting}
              />
            </div>
          )}
        </fieldset>
      );
    } else if (field.isFieldsetMember || field.isFieldsetEnd) {
      // These are rendered as part of the fieldset above
      return null;
    } else {
      // Regular field outside of fieldset
      return (
        <div key={key} className={cn(gridClass, 'py-4')}>
          <DynamicFormField field={field} form={form} disabled={isSubmitting} />
        </div>
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {Object.entries(groupedFields).map(([groupName, fields], i) => (
          <div key={i}>
            <div>
              {groupName !== 'default' && (
                <h3 className="mb-4 text-lg leading-none font-semibold">
                  {groupName}
                </h3>
              )}
            </div>
            <Card key={groupName} className="mb-8 py-2">
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                  {fields.map((field, index) =>
                    renderField(field, index, fields),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        <div className="flex gap-2.5">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 animate-spin" />
            )}
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            type="reset"
            variant="outline"
            size="lg"
            onClick={() => handleReset()}
            disabled={form.formState.isSubmitting}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  );
}
