import { z } from 'zod';

import type { ProcessedForm } from '@/types/form';

export function createFormSchema(spec: ProcessedForm) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  spec.fields.forEach((field) => {
    let fieldSchema: any;

    switch (field.type) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${field.label} is required`,
          );
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      // ! TODO
      case 'number':
      case 'select':
      case 'datetime':
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
