import React from "react";
import { GridColumns, useDataGrid } from "@pankod/refine-mui";
import { DataGridBox, StyledDataGrid } from "../profile-components";
import { ColumnSettingsModal } from "../../column-settings-modal";
import { DataGridHeader, HeaderProps } from "../../header/datagrid-header";

interface DataGridProps {
  columns: GridColumns;
  fields: string[];
  buttons?: HeaderProps["buttons"];
  label: HeaderProps["label"];
}

export const DataGridComponent = ({
  columns,
  fields,
  buttons,
  label,
}: DataGridProps) => {
  const dataGrid = useDataGrid({
    metaData: {
      fields: fields,
    },
  });
  return (
    <DataGridBox>
      <DataGridHeader buttons={buttons} label={label} />
      <StyledDataGrid
        components={{
          ColumnsPanel() {
            return <ColumnSettingsModal />;
          },
        }}
        {...dataGrid.dataGridProps}
        columns={columns}
        autoHeight
        sx={{}}
        // throws errors without sx
      />
    </DataGridBox>
  );
};
