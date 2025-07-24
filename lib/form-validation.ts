import { z } from 'zod';

import type { ProcessedForm } from '@/types/form';

export function createFormSchema(spec: ProcessedForm) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  spec.fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
        if (field.required) {
          fieldSchema = z.string({
            required_error: `${field.label} is required`,
          });
        } else {
          fieldSchema = z.string().optional();
        }
        break;

      case 'number':
        if (field.required) {
          fieldSchema = z
            .number({
              required_error: `${field.label} is required`,
            })
            .min(0, `${field.label} must be a positive number`);
        } else {
          fieldSchema = z.number().optional();
        }
        break;

      case 'select':
        if (field.required) {
          fieldSchema = z
            .string({ required_error: `${field.label} is required` })
            .min(1, `${field.label} is required`);
        } else {
          fieldSchema = z.string().optional();
        }
        break;

      case 'datetime':
        if (field.required) {
          fieldSchema = z.string({
            required_error: `${field.label} is required`,
          });
        } else {
          fieldSchema = z.string().optional();
        }
        // Validate datetime format
        fieldSchema = fieldSchema.refine(
          (val: unknown) =>
            typeof val !== 'string' ||
            val === '' ||
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val),
          {
            message: 'Please enter a valid date and time',
          },
        );
        break;
      case 'photo':
      case 'file':
      case 'checkbox':
        fieldSchema = z.any();
        break;

      default:
        fieldSchema = z.any();
    }

    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
}
