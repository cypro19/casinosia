import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayerCompPointsDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.playerProfile.fields.compPointAccounts",
    selectedColumns: ["id", "history", "accountType", "point", "microPoints"],
  });

  return { columns, fields };
};
