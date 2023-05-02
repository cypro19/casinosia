import { Box, TextField, FormLabel } from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import React from "react";
import { styled } from "@mui/system";

export const Wrapper = styled(Box)`
  max-width: 87rem;
  max-height: 27.1875rem;
  margin: 1rem;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  background-color: white;
  margin: ${(props) => {
    return props.theme.spacing(0.125) + " 0 " + props.theme.spacing(1.25);
  }};
  padding: ${(props) => {
    return props.theme.spacing(0.125) + " 1 " + props.theme.spacing(1.25);
  }};
  column-gap: ${(props) => {
    return props.theme.spacing(1.375);
  }};
`;

export const StyledFormLabel = styled(FormLabel)`
  font-size: 0.688rem;
`;

export const FormWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  row-gap: ${(props) => {
    return props.theme.spacing(1);
  }};
  column-gap: ${(props) => {
    return props.theme.spacing(1);
  }};
`;

type FormProps = {
  children: JSX.Element;
};

export const MainForm = ({ children }: FormProps) => {
  return (
    <Wrapper component="form" sx={{ display: "flex", height: "100%" }}>
      {children}
    </Wrapper>
  );
};

export const FormContainer = styled(Box)`
  display: flex;
  height: 100%;
  flex-direction: column;
  flex-grow: 1;
  margin: ${(props) => {
    return props.theme.spacing(0.125) + " 0 " + props.theme.spacing(1.25);
  }};
  column-gap: ${(props) => {
    return props.theme.spacing(1.375);
  }};
  row-gap: ${(props) => {
    return props.theme.spacing(1.375);
  }};
`;

export const FormInputRow = styled(Box)`
  display: flex;
  flex-grow: 2;
  column-gap: 1rem;
`;

export const FormInputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(0.4375);
  }};
  flex-grow: 1;
`;

export const StyledInput = styled(TextField)`
  border: 0.025rem solid inherit;
  font-family: inherit;
  font-size: 0.875rem;
  border-radius: 0.3125rem;
  transition: 0.3s all ease-in;
  &:focus,
  &:active,
  &:hover {
    border-color: #747cee;
    color: #747cee;
  }

  &:after,
  &:before {
    display: none;
  }
`;

export const ColorButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: "#6366F1",
  borderRadius: "0.75rem",
  width: "12.5rem",
  heigth: "2.625rem",
  padding: "0",
  fontFamily: "inherit",
  fontWeight: "400",
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#7275f2",
  },
}));
