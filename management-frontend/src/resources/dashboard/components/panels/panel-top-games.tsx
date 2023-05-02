import { Button, List, ListItem, Typography } from "@mui/material";
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

const StyledButton = styled(Button)`
  padding: 0;
  font-size: 0.8125rem;
  color: #111927;
  font-weight: 600;
  text-transform: capitalize;
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  padding-top: ${(props) => {
    return props.theme.spacing(0.9375);
  }};
`;

const StyledListItem = styled(ListItem)`
  padding: 0;
  display: flex;
  justify-content: space-between;
  padding: ${(props) => {
    return props.theme.spacing(0.625) + " 0";
  }};
  border-bottom: 0.0625rem solid #f2f4f7;
`;

const PlayerId = styled(Typography)`
  margin: 0;
  font-size: 0.875rem;
  color: #111927;
`;

const PlayerDeposit = styled(Typography)`
  margin: 0;
  font-size: 0.875rem;
  color: #15b79e;
`;

interface PlayerProps {
  id: string;
  amount: string;
}

const Player: React.FC<PlayerProps> = ({ id, amount }) => {
  return (
    <>
      <PlayerId>{id}</PlayerId>
      <PlayerDeposit>{amount}</PlayerDeposit>
    </>
  );
};

const PanelTopGames = () => {
  const translate = useTranslate();
  return (
    <Panel
      header={
        <Header>{translate("page.dashboard.panels.top-games.title")}</Header>
      }
      link={
        <StyledButton variant="text" endIcon={<ArrowForwardRoundedIcon />}>
          {translate("page.dashboard.panels.top-games.button")}
        </StyledButton>
      }
    >
      <StyledList>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
        <StyledListItem>
          <Player id="Player ID" amount="$247.89" />
        </StyledListItem>
      </StyledList>
    </Panel>
  );
};

export default PanelTopGames;
