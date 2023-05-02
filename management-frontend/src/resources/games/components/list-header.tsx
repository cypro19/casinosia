import {
  Add,
  ArrowDropDown,
  FileDownload,
  MonetizationOn,
} from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/system";
import { useTranslate } from "@pankod/refine-core";

// Container <section> element to contain this component.
const Container = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => {
    return props.theme.spacing(0.4375) + " " + props.theme.spacing(1);
  }};
  border-radius: 0.1875rem;
  background-color: #747cee;
`;

// Text Heading
const Heading = styled(Typography)`
  font-size: 1rem;
  color: #fff;
  line-height: 1.375rem;
  font-weight: 400;
`;

// Button group for actions on this list
const ButtonGroup = styled(Box)`
  display: flex;
  align-items: center;
  column-gap: ${(props) => {
    return props.theme.spacing(0.5);
  }};
`;

// Styled Button
const StyledButton = styled(Button)`
  background-color: #fff;
  color: #000;
  padding: ${(props) => {
    return props.theme.spacing(0.5625) + " " + props.theme.spacing(0.9375);
  }};
  border-radius: 0.1875rem;
  font-size: 0.875rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

// Bulk Action button. Including the dropdowns.
const ButtonDropDown = () => {
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

  const translate = useTranslate();

  return (
    <Box>
      <StyledButton
        variant="contained"
        endIcon={<ArrowDropDown />}
        onClick={handleOpen}
      >
        {translate("page.games.buttons.bulk-actions")}
      </StyledButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.add-category")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.add-feature")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.set-theme")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.append-to-collection")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.prepend-to-collection")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.enable")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.disable")}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {translate("page.games.buttons.delete")}
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Component
const ListHeader = () => {
  const translate = useTranslate();
  return (
    <Container>
      <Heading>Showing 1 to 10 of 57 entries</Heading>
      <ButtonGroup>
        <ButtonDropDown />
        <StyledButton variant="contained" startIcon={<MonetizationOn />}>
          {translate("page.games.buttons.manage-currencies")}
        </StyledButton>
        <StyledButton variant="contained" startIcon={<FileDownload />}>
          {translate("page.games.buttons.import")}
        </StyledButton>
        <StyledButton variant="contained" startIcon={<Add />}>
          {translate("page.games.buttons.add-games")}
        </StyledButton>
      </ButtonGroup>
    </Container>
  );
};

export default ListHeader;
