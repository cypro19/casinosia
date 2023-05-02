import React, { useState } from "react";
import { Box, styled } from "@mui/system";
import { Link } from "react-router-dom";
import { ITreeMenu, useMenu } from "@pankod/refine-core";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

export const StyledLink = styled(Link)`
  color: #b5bcc4;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: 0.3s all ease-in;
  position: relative;
  padding-left: ${(props) => {
    return props.theme.spacing(1.875);
  }};

  i {
    color: #fff;
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);

    svg {
      position: absolute;
      top: 50%;
      width: 100%;
      left: 0;
      fill: #fff;
      transform: translateY(-50%);
    }
  }

  &:hover,
  &.selected {
    color: #fff;
  }

  &.selected svg {
    fill: #6366f1;
  }
`;

const MenuGroup = styled(Accordion)`
  background-color: transparent;
  background-image: unset;
  box-shadow: unset;
  margin: 0;

  .MuiAccordionSummary-root.Mui-expanded {
    min-height: unset !important;
  }

  .MuiAccordionDetails-root {
    padding: ${(props) => {
      return props.theme.spacing(0.625) + " 0 0";
    }};
    display: flex;
    flex-direction: column;
    row-gap: ${(props) => {
      return props.theme.spacing(0.625);
    }};
  }
`;

const MenuGroupTitle = styled(AccordionSummary)`
  padding: 0;
  margin: 0;
  min-height: unset;
  position: relative;

  span {
    color: #fff;
    font-size: 0.875rem;
    padding-left: ${(props) => {
      return props.theme.spacing(1.875);
    }};
  }

  .MuiAccordionSummary-content {
    margin: 0;
  }

  .MuiAccordionSummary-expandIconWrapper svg {
    fill: #fff;
  }
`;

const MenuGroupChildren = styled(AccordionDetails)`
  margin: 0;

  &StyledLink::before {
    content: "";
    display: block;
    position: absolute;
    height: 0.5rem;
    width: 0.5rem;
    top: 50%;
    left: ${(props) => {
      return props.theme.spacing(0.3125);
    }};
    border-radius: 50%;
    background-color: transparent;
    transform: translateY(-50%);
    transition: 0.3s all ease-in;
  }

  &StyledLink:hover::before,
  &StyledLink.selected::before {
    background-color: #6366f1;
  }
`;

const MenuIcon = styled(Box)`
  color: #fff;
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

export const MenuItems = (items: ITreeMenu[]) => {
  const { selectedKey } = useMenu();

  return (
    <>
      {items.map(({ name, label, icon, route, children, list }) => {
        const selected: boolean = route === selectedKey;

        const [expanded, setExpanded] = useState(selected);

        const handleChange = () => {
          setExpanded(!expanded);
        };

        if (!list) {
          return (
            <MenuGroup key={label} expanded={expanded} onChange={handleChange}>
              <MenuGroupTitle expandIcon={<ExpandMoreIcon />}>
                <MenuIcon
                  style={{
                    backgroundImage: `url(${icon})`,
                  }}
                ></MenuIcon>
                <span>{label ?? name}</span>
              </MenuGroupTitle>
              <MenuGroupChildren>
                {children ? MenuItems(children) : null}
              </MenuGroupChildren>
            </MenuGroup>
          );
        }

        return (
          <Box key={label}>
            <StyledLink to={route || ""} className={selected ? "selected" : ""}>
              <MenuIcon
                style={{
                  backgroundImage: `url(${icon})`,
                }}
              ></MenuIcon>
              <span>{label ?? name}</span>
            </StyledLink>
          </Box>
        );
      })}
    </>
  );
};
