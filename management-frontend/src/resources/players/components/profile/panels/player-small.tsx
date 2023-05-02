import { Box, Button, List, ListItem, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { useTranslate } from "@pankod/refine-core";
import { styled } from "@mui/system";

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-width: 20.2706rem;
  min-height: 8.7813rem;
  max-width: 20.2706rem;
  max-height: 8.7813rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 1;
`;
interface PlayerPanelSmallProps {
  children?: ReactNode;
}

export const PlayerPanelSmall: React.FC<PlayerPanelSmallProps> = ({
  children,
}) => {
  return <Card> {children} </Card>;
};
