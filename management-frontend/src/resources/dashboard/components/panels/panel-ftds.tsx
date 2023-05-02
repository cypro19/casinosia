import React from "react";
import { useTranslate } from "@pankod/refine-core";
import { styled } from "@mui/system";

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

const PanelFTDs = () => {
  const translate = useTranslate();
  return (
    <Panel
      header={<Header>{translate("page.dashboard.panels.ftds.title")}</Header>}
    >
      <Counter>32</Counter>
    </Panel>
  );
};

export default PanelFTDs;
