import React from "react";
import { Box, Button, IconButton, Modal, Paper } from "@pankod/refine-mui";
import { styled } from "@mui/system";

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledPaper = styled(Paper)`
  background-color: white;
  font-family: inherit;
  padding: ${(props) => {
    return props.theme.spacing(2, 4, 3);
  }};
  min-width: 50vw;
  min-height: 55vh;
  outline: none;
  border-radius: 1.25rem;
  .MuiDataGrid-panelWrapper {
    z-index: 99;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    place-self: center;
    align-self: center;
  }

  .MuiDataGrid-panelFooter {
    display: none;
  }
  .MuiDataGrid-panelHeader {
    display: none;
  }
  .MuiDataGrid-columnsPanel {
    width: 100%;
    height: 100%;
    padding: 1.66rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.625rem;
  }
  .MuiDataGrid-columnsPanelRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    color: #111927;
  }
  .PrivateSwitchBase-input {
    color: #6366f1;
    background-color: #6366f1;
  }
  .MuiSwitch-thumb {
    color: #6366f1;
    background-color: #6366f1;
  }
  .MuiSwitch-track {
    background-color: #6366f1;
    color: #6366f1;
  }
  .css-wcoosa-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked
    + .MuiSwitch-track {
    background-color: #6366f1;
    color: #6366f1;
  }

  .gridcolumns {
    height: 25rem;
  }
`;

export const StyledHeader = styled("header")`
  display: flex;
  align-self: flex-start;
  justify-content: space-between;
  align-items: center;
  color: #111927;
  fontweight: 700;
  fontsize: 1.125rem;
  font-style: normal;
  font-family: Plus Jakarta Sans;
  margin-bottom: ${(props) => {
    return props.theme.spacing(2);
  }};
`;

export const StyledIconButton = styled(IconButton)`
  padding: 0;
  margin-right: -1rem;
  alignself: flex-end;
  &:hover {
    background-color: transparent;
  }
`;

export const StyledBtnContainer = styled(Box)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const SaveButton = styled(Button)`
  background-color: #6366f1;
  box-shadow: 0rem 0.0625rem 0.125rem rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  font-style: normal;
  margin-right: 2rem;
  &:hover {
    background-color: #6366f1;
  }
`;
