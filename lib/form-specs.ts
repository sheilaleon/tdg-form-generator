import { processFormTemplate } from '@/lib/form-processor';
import { formTemplates } from '@/lib/form-templates';

import type { ProcessedForm } from '@/types/form';

export const formSpecs: ProcessedForm[] = formTemplates.map((template) => {
  try {
    return processFormTemplate(template);
  } catch (error) {
    console.error(
      `Error processing form template ${template.formName}:`,
      error,
    );
    return {
      id: template.formId,
      title: `Error: ${template.formName}`,
      fields: [],
    };
  }
});
