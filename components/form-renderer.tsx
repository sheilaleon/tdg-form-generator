import { DynamicFormField } from './dynamic-form-field';
import { Card, CardContent } from './ui/card';
import { Form } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { createFormSchema } from '@/lib/form-validation';
import { cn } from '@/lib/utils';

import { ProcessedForm } from '@/types/form';

interface FormRendererProps {
  spec: ProcessedForm;
  onSubmit: (data: any) => void;
}

export function FormRenderer({ spec, onSubmit }: FormRendererProps) {
  const schema = createFormSchema(spec);

  // Create default values from the spec
  const defaultValues = spec.fields.reduce(
    (acc, field) => {
      if (field.defaultValue !== undefined) {
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
  });

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

  const handleSubmit = (data: any) => {
    onSubmit(data);
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
        <fieldset key={key} className="space-y-4 rounded-lg py-4 md:col-span-2">
          <legend className="sr-only px-2 text-base font-semibold text-gray-900">
            {field.fieldsetTitle}
          </legend>

          {/* Main field and photo side by side */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <DynamicFormField field={field} form={form} />
            </div>

            {photoField && (
              <div>
                <DynamicFormField
                  field={photoField}
                  form={form}
                  mainFieldName={field.name}
                />
              </div>
            )}
          </div>

          {/* Comment field underneath both */}
          {commentField && (
            <div className="mt-4">
              <DynamicFormField field={commentField} form={form} />
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
          <DynamicFormField field={field} form={form} />
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
                <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
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
            Submit
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => form.reset(defaultValues)}
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  );
}
