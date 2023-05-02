import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayerAccountDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.playerProfile.fields.account",
    selectedColumns: [
      "id",
      "cur",
      "balance",
      "deposit",
      "cashout",
      "pendingCashout",
      "refundsSum",
      "reversals",
      "affiliates",
      "gifts",
      "ngr",
      "bonuses",
      "bonusRatio",
    ],
  });

  return { columns, fields };
};
