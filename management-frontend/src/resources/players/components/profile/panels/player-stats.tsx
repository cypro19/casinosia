import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import { styled } from "@mui/system";

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0rem;
  width: 64.8125rem;
  height: 26.7813rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  flex: 1;
  order: 1;
`;
interface PlayerInfoStatsProps {
  children?: ReactNode;
}

export const PlayerPanelStats: React.FC<PlayerInfoStatsProps> = ({
  children,
}) => {
  return <Card>{children}</Card>;
};
