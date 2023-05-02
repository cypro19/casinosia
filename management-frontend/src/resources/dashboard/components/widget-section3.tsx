import React from "react";
import { styled } from "@mui/system";

import PanelTopDeposits from "./panels/panel-top-deposits";
import PanelTopGames from "./panels/panel-top-games";
import PanelTopWinnings from "./panels/panel-top-winnings";

const SectionContainer = styled("section")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
`;

const WidgetSection3 = () => {
  return (
    <SectionContainer>
      <PanelTopDeposits />
      <PanelTopGames />
      <PanelTopWinnings />
    </SectionContainer>
  );
};

export default WidgetSection3;
