export interface FormField {
  IDX: number;
  formid: string;
  formName: string;
  fieldid: string;
  categoryOrder: number;
  fieldOrder: number;
  category: string;
  title: string;
  fieldName: string;
  fieldType: string;
  dataType: string;
  dropVals: string | null;
  fillMethod: string | null;
  commentField: number;
  commentFieldName: string | null;
  helpText: string | null;
  requiresPhoto: number;
  visible: number;
  inputReq: number;
  defautVal: string | null;
}

export interface FormTemplate {
  formName: string;
  formId: string;
  fields: FormField[];
}

export interface ProcessedField {
  name: string;
  type:
    | 'text'
    | 'number'
    | 'select'
    | 'datetime'
    | 'photo'
    | 'textarea'
    | 'file'
    | 'checkbox';
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  group: string;
  defaultValue?: string | number | boolean;
  options?: Array<{ label: string; value: string }>;
  fullWidth?: boolean;
}

export interface ProcessedForm {
  id: string;
  title: string;
  fields: ProcessedField[];
}
