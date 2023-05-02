import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayerIssuedBonusesDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.playerProfile.fields.issuedBonuses",
    selectedColumns: [
      "issuedAt",
      "bonus",
      "amount",
      "stage",
      "amountLocked",
      "wager",
      "expired",
      "action",
    ],
  });

  return { columns, fields };
};
