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
