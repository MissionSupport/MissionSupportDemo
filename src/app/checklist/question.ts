export interface Validator {
  name: string;
  validator: any;
  message: string;
}

export interface Question {
  label: string;
  name?: string;
  type: 'dropdown' | 'freeResponse' | 'image' | 'medicineMultipleCheckbox'
    | 'medicineMultipleTextbox'| 'medicineTextbox' | 'multipleSelect' | 'radioButton'
    | 'textbox';
  options?: {key: string, value: string}[];
  value?: any;
  gridSize: string;
  key: string;
  height?: number;
  validators: Validator[];
}
