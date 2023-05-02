import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

interface PanelProps {
  header: ReactNode;
  children: ReactNode;
  link?: ReactNode;
}

const PanelContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const PanelHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  padding: ${(props) => {
    return (
      props.theme.spacing(0) +
      " " +
      props.theme.spacing(1.5) +
      " " +
      props.theme.spacing(0.5)
    );
  }};
`;

const PanelContent = styled(Box)`
  padding: ${(props) => {
    return (
      props.theme.spacing(0) +
      " " +
      props.theme.spacing(1.5) +
      " " +
      props.theme.spacing(0.5)
    );
  }};
`;

const PanelLink = styled(Box)`
  padding: ${(props) => {
    return props.theme.spacing(0.75) + " " + props.theme.spacing(1.5);
  }};
  border-top: 0.0625rem solid #f2f4f7;
`;

const Panel: React.FC<PanelProps> = ({ header, children, link }) => {
  return (
    <PanelContainer>
      <PanelHeader>{header}</PanelHeader>
      <PanelContent>{children}</PanelContent>
      {link && <PanelLink>{link}</PanelLink>}
    </PanelContainer>
  );
};

export default Panel;
