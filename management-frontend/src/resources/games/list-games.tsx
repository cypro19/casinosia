import {
  Chip,
  DataGrid,
  GridColumns,
  List,
  useDataGrid,
} from "@pankod/refine-mui";
import React from "react";
import { styled } from "@mui/system";
import { useTranslate } from "@pankod/refine-core";

import Header from "./components/header";
import ListHeader from "./components/list-header";
import Form from "./components/list-search-form";
import { useTranslation } from "react-i18next";

const PageContainer = styled("main")`
  width: 87rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
  padding-bottom: ${(props) => {
    return props.theme.spacing(2);
  }};
`;

export const ListGames = () => {
  const dataGrid = useDataGrid({
    resource: "games",
    metaData: {
      fields: [
        "id",
        "name",
        "softwareProvider",
        "collections",
        "rtp",
        "devices",
        "minBet",
      ],
    },
  });

  const translate = useTranslate();

  const columns = React.useMemo<GridColumns>(
    () => [
      {
        field: "id",
        headerName: translate("page.games.fields.id"),
        type: "string",
        width: 150,
      },
      {
        field: "name",
        headerName: translate("page.games.fields.name"),
        minWidth: 300,
        flexGrow: 1,
      },
      {
        field: "softwareProvider",
        headerName: translate("page.games.fields.software-provider"),
        minWidth: 200,
        flexGrow: 0,
      },
      {
        field: "collections",
        headerName: translate("page.games.fields.collections"),
        minWidth: 150,
        flex: 1,
      },
      {
        field: "rtp",
        headerName: translate("page.games.fields.rtp"),
        minWidth: 150,
        flex: 1,
      },
      {
        field: "devices",
        headerName: translate("page.games.fields.devices"),
        minWidth: 150,
        flex: 1,
      },
      {
        field: "minBet",
        headerName: translate("page.games.fields.min-bet"),
        minWidth: 150,
        flex: 1,
      },
    ],
    []
  );

  return (
    <>
      <PageContainer>
        <Header />
        <List title={<ListHeader />}>
          <Form />
          <DataGrid {...dataGrid.dataGridProps} columns={columns} autoHeight />
        </List>
      </PageContainer>
    </>
  );
};
