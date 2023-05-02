import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayerLastPaymentsDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.playerProfile.fields.lastPayments",
    selectedColumns: [
      "source",
      "currency",
      "adminUser",
      "manual",
      "returnType",
      "comment",
      "success",
      "finishedAt",
    ],
  });

  return { columns, fields };
};
