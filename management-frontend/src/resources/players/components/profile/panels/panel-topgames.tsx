import { Box, ListItem } from "@mui/material";
import React, { ReactNode } from "react";
import { styled } from "@mui/system";
import { List } from "@pankod/refine-mui";

export const StyledListGames = styled(List)`
  min-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: red;
`;

export const StyledListItemGames = styled(ListItem)`
  min-width: 100%;
  min-height: 100%;
  padding: 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.0625rem solid #f2f4f7;
`;

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 27.5625rem;
  height: 28.625rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
interface PlayerTopGamesProps {
  children?: ReactNode;
}

export const PlayerTopGames: React.FC<PlayerTopGamesProps> = ({ children }) => {
  return <Card>{children}</Card>;
};
