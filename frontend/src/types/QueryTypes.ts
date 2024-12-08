import { AppSheetData } from '@/pages/AppSheetsPage';

type UseMutationAppSheetDelete = {
  TData: { message: string };
  TError: { error: Error };
  TVariables: { appSheetId: string };
  TContext: { previousAppSheets: AppSheetData[] | undefined };
};

type MutationTuple<
  T extends {
    TData: unknown;
    TError: unknown;
    TVariables: unknown;
    TContext: unknown;
  },
> = [T['TData'], T['TError'], T['TVariables'], T['TContext']];

export type UseMutationAppSheetDeleteTuple = MutationTuple<UseMutationAppSheetDelete>;
