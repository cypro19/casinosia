import { Button, ButtonGroup } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/system";
import { useTranslate } from "@pankod/refine-core";

const HeaderContainer = styled("header")`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledH1 = styled("h1")`
  font-weight: 700;
  font-size: 2rem;
  margin: 0;
  color: #111927;
`;

const StyledButton = styled(Button)<{ isSelected: boolean }>`
  text-transform: capitalize;
  color: #6366f1;
  border-color: #b1b3f8;
  font-size: 0.875rem;
  padding: ${(props) => {
    return props.theme.spacing(0.375) + " " + props.theme.spacing(1);
  }};

  ${({ isSelected }) =>
    isSelected &&
    `
    background-color: #6366f1;
    color: #fff;

    &:hover {
      background-color: #6366f1;
      border-color: #b1b3f8;
      color: #fff;
    }
  `}
`;

const Header = () => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  const handleButtonClick = (index: number) => {
    setSelectedButtonIndex(index);
  };

  const translate = useTranslate();

  return (
    <HeaderContainer>
      <StyledH1>{translate("page.dashboard.name")}</StyledH1>
      <ButtonGroup size="small">
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 0}
          onClick={() => handleButtonClick(0)}
        >
          {translate("page.dashboard.components.date-range.today")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 1}
          onClick={() => handleButtonClick(1)}
        >
          {translate("page.dashboard.components.date-range.yesterday")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 2}
          onClick={() => handleButtonClick(2)}
        >
          {translate("page.dashboard.components.date-range.week")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 3}
          onClick={() => handleButtonClick(3)}
        >
          {translate("page.dashboard.components.date-range.month")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 4}
          onClick={() => handleButtonClick(4)}
        >
          {translate("page.dashboard.components.date-range.last30days")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 5}
          onClick={() => handleButtonClick(5)}
        >
          {translate("page.dashboard.components.date-range.custom")}
        </StyledButton>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default Header;
