import { useTranslate } from "@pankod/refine-core";
import { GridColumns } from "@pankod/refine-mui";
import React from "react";

type Props = {
  translatePrefix: string;
  selectedColumns: string[];
};

export const useDataGridColumns = ({
  translatePrefix,
  selectedColumns,
}: Props) => {
  const translate = useTranslate();

  const columns = React.useMemo<GridColumns>(
    () =>
      selectedColumns.map((col, index) => ({
        field: `${translatePrefix}.${col}`,
        headerName: translate(`${translatePrefix}.${col}`),
        headerAlign: "center",
        type: "string",
        flex: 1,
        hide: index < 12 ? false : true,
      })),
    [translate, translatePrefix, selectedColumns]
  );

  const fields = React.useMemo<string[]>(
    () => selectedColumns.map((col) => translate(`${translatePrefix}.${col}`)),
    [translate, translatePrefix, selectedColumns]
  );

  return { columns, fields };
};
