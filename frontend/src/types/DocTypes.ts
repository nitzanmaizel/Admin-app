export interface IDocData {
  docId: string;
  title: string;
  description: string;
  databaseModel: string;
  docItems: IDocItemData[];
  additionalData?: AdditionalData[];
  columns: {
    field: string;
    headerName: string;
    flex: number;
    cellType?: 'input' | 'select';
    config?: {
      value?: string;
      options?: { value: string; label: string }[];
    };
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDocItemData {
  docId: string;
  docItemId: string;
  databaseDocId: string;
  databaseModel: string;
  data: { [k: string]: unknown };
  additionalData: AdditionalData[];
}

export type AdditionalData = {
  key: string;
  label?: string;
  value?: string;
};
