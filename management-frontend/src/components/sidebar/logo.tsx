import React from "react";
import { Box, styled } from "@mui/system";

import Logo from "@assets/logo.svg";

const StyledLogo = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: center;

  svg {
    height: 2.25rem;
  }
`;

export const LogoContainer = () => {
  return (
    <StyledLogo>
      <img src={Logo} />
    </StyledLogo>
  );
};
