import React from "react";
import { Box } from "@pankod/refine-mui";
import { styled } from "@mui/system";
import { Form } from "./components/list-search-form/list-search-form";
import { usePlayersDataGrid } from "./hooks/usePlayersDataGrid";
import { DataGridComponent } from "./components/profile/datagrids/use-datagrid";
import { useTranslate } from "@pankod/refine-core";

export const PageContainer = styled(Box)`
  max-width: 87rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justicy-content: center;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
  padding-bottom: ${(props) => {
    return props.theme.spacing(2);
  }};
  .box {
    border-radius: 1.25rem;
  }
`;

export const ListPlayers = () => {
  const translate = useTranslate();
  const startIndex = 1;
  const endIndex = 10;
  const totalEntries = 57;
  const labels = translate("page.players.entries.showing-entries", {
    startIndex,
    endIndex,
    totalEntries,
  });
  const { fields, columns } = usePlayersDataGrid();

  return (
    <PageContainer>
      <Form />
      <Box className="box">
        <DataGridComponent
          label={labels}
          buttons={[
            {
              label: "Export",
              color: "inherit",
              onClick: () => console.log("hi"),
            },
            {
              label: "Select Action",
              color: "info",
              onClick: () => console.log("hi"),
            },
          ]}
          fields={fields}
          columns={columns}
        />
      </Box>
    </PageContainer>
  );
};
