export interface NewSheetData {
  _id?: string;
  title: string;
  description: string;
  additionalData: { key: string; value: string }[];
  createdAt?: string;
  updatedAt?: string;
}
