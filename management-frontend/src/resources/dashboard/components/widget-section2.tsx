import React from "react";
import { styled } from "@mui/system";

import PanelDeposits from "./panels/panel-deposits";
import PanelCashouts from "./panels/panel-cashouts";
import PanelPendingCashouts from "./panels/panel-pending-cashouts";

const SectionContainer = styled("section")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
`;

const WidgetSection2 = () => {
  return (
    <SectionContainer>
      <PanelDeposits />
      <PanelCashouts />
      <PanelPendingCashouts />
    </SectionContainer>
  );
};

export default WidgetSection2;
