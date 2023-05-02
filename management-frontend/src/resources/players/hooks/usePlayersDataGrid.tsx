import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayersDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.players.fields",
    selectedColumns: [
      "id",
      "name",
      "balance",
      "deposits",
      "withdrawals",
      "currency",
      "lastlogin",
      "affiliateID",
      "registeredDate",
      "country",
      "personalVerification",
      "paymentsVerification",
      "depositNumbers",
      "managers",
      "cashoutNumbers",
      "phoneNumber",
      "tags",
      "groups",
      "points",
      "lastUsedIP",
      "netRevenue",
      "smsOptIn",
      "emailOptIn",
    ],
  });

  return { columns, fields };
};
