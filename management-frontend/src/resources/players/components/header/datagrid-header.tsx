import { Box, Button, ButtonProps, IconProps, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  padding-left: ${(props) => {
    return props.theme.spacing(1);
  }};
  padding-right: ${(props) => {
    return props.theme.spacing(1);
  }};
  padding-top: ${(props) => {
    return props.theme.spacing(0.6);
  }};
  .text {
    color: black;
  }
`;

const StyledBoxInner = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;

  gap: 1rem;
`;

export interface HeaderProps {
  label: string;
  buttons?: {
    label: string;
    color?: ButtonProps["color"];
    onClick: () => void;
    icon?: IconProps;
  }[];
}

export const DataGridHeader: React.FC<HeaderProps> = ({
  label,
  buttons = [],
}) => {
  return (
    <StyledBox>
      <Typography className="text" variant="h6">
        {label}
      </Typography>
      <StyledBoxInner>
        {buttons.map(({ label, color, onClick, icon }) => (
          <Button size="medium" key={label} color={color} onClick={onClick}>
            {label}
          </Button>
        ))}
      </StyledBoxInner>
    </StyledBox>
  );
};
