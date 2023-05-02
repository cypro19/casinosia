import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayerIssuedFreeSpinsDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.playerProfile.fields.issuedFreeSpins",
    selectedColumns: [
      "issuedAt",
      "freespins",
      "stage",
      "winAmount",
      "wager",
      "expired",
      "action",
    ],
  });

  return { columns, fields };
};
