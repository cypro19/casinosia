import React from "react";
import { Box, styled } from "@mui/system";

import { LogoContainer } from "./sidebar/logo";
import { NavigationContainer } from "./sidebar/navigation";

const SidebarContainer = styled(Box)`
  width: 17.5rem;
  background: #1c2536;
  padding: ${(props) => {
    return props.theme.spacing(1.5625) + " " + props.theme.spacing(1.875);
  }};
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(1.875);
  }};
`;

export const Sidebar = () => {
  return (
    <>
      <SidebarContainer>
        <LogoContainer />
        <NavigationContainer />
      </SidebarContainer>
    </>
  );
};
