import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import { styled } from "@mui/system";

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 35.1875rem;
  height: 28.625rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
interface PlayerInfoPanelProps {
  children?: ReactNode;
}

export const PlayerPlayTime: React.FC<PlayerInfoPanelProps> = ({
  children,
}) => {
  return <Card>{children}</Card>;
};
