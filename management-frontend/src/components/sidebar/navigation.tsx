import React from "react";
import { Box, styled } from "@mui/system";
import { useMenu, useRefineContext, useTranslate } from "@pankod/refine-core";
import { MenuItems, StyledLink } from "./menuitem";

const Menu = styled("nav")`
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(1);
  }};

  .Mui-expanded {
    margin: 0 !important;
  }
`;

export const NavigationContainer = () => {
  const { menuItems } = useMenu();
  const { hasDashboard } = useRefineContext();
  const translate = useTranslate();

  return (
    <Menu>
      {hasDashboard && (
        <Box>
          <StyledLink to="/">{translate("page.dashboard.name")}</StyledLink>
        </Box>
      )}
      {MenuItems(menuItems)}
    </Menu>
  );
};
