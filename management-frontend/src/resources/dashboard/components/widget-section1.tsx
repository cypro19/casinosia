import { defaultCipherList } from "constants";
import React from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/material";

import PanelPlayersOnline from "./panels/panel-players-online";
import PanelFTDs from "./panels/panel-ftds";
import PanelNGRs from "./panels/panel-ngr";
import PanelStatistics from "./panels/panel-statistics";

const SectionContainer = styled(Box)`
  display: flex;
  column-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
`;

const SectionLeft = styled(Box)`
  display: flex;
  row-gap: ${(props) => {
    return props.theme.spacing(0.625);
  }};
  flex-direction: column;
  width: 27.6875rem;
  flex-shrink: 0;
  flex-grow: 0;
`;

const SectionRight = styled(Box)`
  width: 100%;
  flex-grow: 1;
  height: 100%;
`;

const WidgetSection1 = () => {
  return (
    <SectionContainer>
      <SectionLeft>
        <PanelPlayersOnline />
        <PanelFTDs />
        <PanelNGRs />
      </SectionLeft>
      <SectionRight>
        <PanelStatistics />
      </SectionRight>
    </SectionContainer>
  );
};

export default WidgetSection1;
