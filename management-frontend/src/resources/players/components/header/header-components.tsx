import { styled } from "@mui/system";
import { ArrowDropDown } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { useTranslate } from "@pankod/refine-core";

export const Container = styled(Box)`
  max-width: 87rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => {
    return props.theme.spacing(0.4375) + " " + props.theme.spacing(1);
  }};
  margin: 0;
  border-top-right-radius: 1.25rem;
  border-top-left-radius: 1.25rem;
  background-color: #fff;
`;

export const Heading = styled(Typography)`
  font-size: 1rem;
  color: black;
  line-height: 1.375rem;
  font-weight: 400;
`;

export const ButtonGroup = styled(Box)`
  display: flex;
  align-items: center;
  column-gap: ${(props) => {
    return props.theme.spacing(1);
  }};
`;

export const StyledButton = styled(Button)`
  background-color: #fff;
  color: black;
  padding: ${(props) => {
    return props.theme.spacing(0.5625) + " " + props.theme.spacing(0.9375);
  }};
  font-size: 0.875rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

export const ButtonDropDown = () => {
  const translate = useTranslate();

  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  const handleOpen = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <StyledButton
        sx={{
          minWidth: "13rem",
          maxWidth: "14rem",
          maxHeight: "2.625rem",
          borderRadius: "0.75rem",
        }}
        variant="contained"
        endIcon={<ArrowDropDown />}
        onClick={handleOpen}
      >
        {translate("page.players.buttons.select-action")}
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.add-bonus")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.block")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.unblock")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.add-tag")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.add-group")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.block-bonus")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.players.buttons.add-manager")}
        </MenuItem>
      </Menu>
    </>
  );
};
