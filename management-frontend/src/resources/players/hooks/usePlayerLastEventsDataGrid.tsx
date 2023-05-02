import { useDataGridColumns } from "./useDataGridColumns";

export const usePlayerLastEventsDataGrid = () => {
  const { columns, fields } = useDataGridColumns({
    translatePrefix: "page.playerProfile.fields.lastEvents",
    selectedColumns: [
      "date",
      "eventType",
      "ip",
      "address",
      "device",
      "coordinates",
    ],
  });

  return { columns, fields };
};
