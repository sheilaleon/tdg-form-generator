import { DynamicFormField } from './dynamic-form-field';
import { Card, CardContent } from './ui/card';
import { Form } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { createFormSchema } from '@/lib/form-validation';

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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {Object.entries(groupedFields).map(([groupName, fields]) => (
          <Card key={groupName}>
            <CardContent className="space-y-6">
              {groupName !== 'default' && (
                <h3 className="text-lg leading-none font-semibold">
                  {groupName}
                </h3>
              )}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.fullWidth ||
                      field.type === 'photo' ||
                      field.type === 'file' ||
                      field.type === 'textarea'
                        ? 'md:col-span-2'
                        : ''
                    }
                  >
                    <DynamicFormField field={field} form={form} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
