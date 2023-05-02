import { Button, Typography } from "@mui/material";
import React from "react";
import { useTranslate } from "@pankod/refine-core";
import { styled } from "@mui/system";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import Panel from "@reusable/panel";

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

const StyledButton = styled(Button)`
  padding: 0;
  font-size: 0.8125rem;
  color: #111927;
  font-weight: 600;
  text-transform: capitalize;
`;

const PanelCashouts = () => {
  const translate = useTranslate();
  return (
    <Panel
      header={
        <Header>{translate("page.dashboard.panels.cashouts.title")}</Header>
      }
      link={
        <StyledButton variant="text" endIcon={<ArrowForwardRoundedIcon />}>
          {translate("page.dashboard.panels.cashouts.button")}
        </StyledButton>
      }
    >
      <Counter>$320 436.78</Counter>
    </Panel>
  );
};

export default PanelCashouts;
