import type {
  FormField,
  FormTemplate,
  ProcessedField,
  ProcessedForm,
} from '@/types/form';

export function processFormTemplate(template: FormTemplate): ProcessedForm {
  // Sort fields by category order then by field order
  const sortedFields = [...template.fields]
    .filter((field) => field.visible === 1)
    .sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) {
        return a.categoryOrder - b.categoryOrder;
      }
      return a.fieldOrder - b.fieldOrder;
    });

  const processedFields: ProcessedField[] = [];

  for (const field of sortedFields) {
    // Add main field
    const mainField = processField(field);
    if (mainField) {
      processedFields.push(mainField);
    }

    // Add comment field if required
    if (field.commentField === 1 && field.commentFieldName) {
      const commentField: ProcessedField = {
        name: field.commentFieldName,
        type: 'textarea',
        label: `${field.title} - Comments`,
        placeholder: 'Enter additional comments...',
        required: false,
        group: field.category,
        fullWidth: true,
      };
      processedFields.push(commentField);
    }

    // Add photo field if required
    if (field.requiresPhoto === 1) {
      const photoField: ProcessedField = {
        name: `${field.fieldName}_photo`,
        type: 'photo',
        label: `${field.title} - Photo`,
        required: field.inputReq === 1,
        group: field.category,
        fullWidth: true,
      };
      processedFields.push(photoField);
    }
  }

  return {
    id: template.formId,
    title: template.formName,
    fields: processedFields,
  };
}

function processField(field: FormField): ProcessedField | null {
  const baseField: ProcessedField = {
    name: field.fieldName,
    type: mapFieldType(field.fieldType),
    label: field.title,
    helpText: field.helpText || undefined,
    required: field.inputReq === 1,
    group: field.category,
    defaultValue: parseDefaultValue(field.defautVal, field.fieldType),
  };

  switch (field.fieldType) {
    case 'text':
      return {
        ...baseField,
        placeholder: `Enter ${field.title.toLowerCase()}...`,
      };

    case 'textarea':
      return {
        ...baseField,
        type: 'textarea',
        placeholder: `Enter ${field.title.toLowerCase()}...`,
        fullWidth: true,
      };

    case 'numberInt':
      return {
        ...baseField,
        type: 'number',
        placeholder: `Enter ${field.title.toLowerCase()}...`,
      };

    case 'select':
      if (field.dropVals) {
        try {
          const dropVals = JSON.parse(field.dropVals);
          const options = Object.entries(dropVals).map(([key, value]) => ({
            label: value as string,
            value: key,
          }));

          return {
            ...baseField,
            options,
            placeholder: 'Select an option...',
          };
        } catch (error) {
          console.error('Error parsing dropdown values:', error);
          return null;
        }
      }
      return null;

    case 'datetime':
      return {
        ...baseField,
        helpText: field.helpText || 'Select date and time',
      };

    case 'photo':
      return {
        ...baseField,
        type: 'photo',
        fullWidth: true,
      };

    case 'file':
      return {
        ...baseField,
        type: 'file',
        fullWidth: true,
      };

    case 'checkbox':
      return {
        ...baseField,
        type: 'checkbox',
      };

    default:
      return baseField;
  }
}

function mapFieldType(fieldType: string): ProcessedField['type'] {
  switch (fieldType) {
    case 'text':
      return 'text';
    case 'textarea':
      return 'textarea';
    case 'numberInt':
      return 'number';
    case 'select':
      return 'select';
    case 'datetime':
      return 'datetime';
    case 'photo':
      return 'photo';
    case 'file':
      return 'file';
    case 'checkbox':
      return 'checkbox';
    default:
      return 'text';
  }
}

function parseDefaultValue(
  defautVal: string | null,
  fieldType: string,
): string | number | boolean | undefined {
  if (defautVal === null) return undefined;

  switch (fieldType) {
    case 'numberInt':
      const num = Number(defautVal);
      return isNaN(num) ? undefined : num;
    case 'checkbox':
      return defautVal === 'true' || defautVal === '1';
    default:
      return defautVal;
  }
}
