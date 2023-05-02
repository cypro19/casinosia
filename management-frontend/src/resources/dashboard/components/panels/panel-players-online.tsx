import React from "react";
import { styled } from "@mui/system";
import { useTranslate } from "@pankod/refine-core";

import Panel from "@reusable/panel";
import { Typography } from "@mui/material";

const Header = styled(Typography)`
  font-weight: 700;
  font-size: 1.125rem;
  margin: 0;
  color: #111927;
`;

const Counter = styled(Typography)`
  margin: 0;
  font-weight: 700;
  font-size: 2.25rem;
  color: #111927;
`;

const PanelPlayersOnline = () => {
  const translate = useTranslate();
  return (
    <Panel
      header={
        <Header>
          {translate("page.dashboard.panels.players-online.title")}
        </Header>
      }
    >
      <Counter>4562</Counter>
    </Panel>
  );
};

export default PanelPlayersOnline;
