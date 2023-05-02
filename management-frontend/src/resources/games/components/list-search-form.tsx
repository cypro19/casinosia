import {
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/system";
import { useTranslate } from "@pankod/refine-core";

const FormContainer = styled(Box)`
  display: flex;
  margin: ${(props) => {
    return props.theme.spacing(0.125) + " 0 " + props.theme.spacing(1.25);
  }};
  column-gap: ${(props) => {
    return props.theme.spacing(1.375);
  }};
`;

const FormInputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(0.4375);
  }};
  flex-grow: 1;
`;

const FormRow = styled(Box)`
  display: flex;
  column-gap: ${(props) => {
    return props.theme.spacing(1.375);
  }};
`;

const StyledInput = styled(Input)`
  border: 0.125rem solid #abb5ba;
  font-family: inherit;
  font-size: 0.875rem;
  padding: ${(props) => {
    return props.theme.spacing(0.625) + " " + props.theme.spacing(0.9375);
  }};
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

const Form = () => {
  const translate = useTranslate();

  return (
    <>
      <FormContainer>
        <FormInputContainer>
          <FormLabel>{translate("page.games.search.search.label")}</FormLabel>
          <StyledInput
            id="outlined-basic"
            placeholder={translate("page.games.search.search.placeholder")}
          />
        </FormInputContainer>

        <FormInputContainer>
          <FormLabel>
            {translate("page.games.search.software-provider.label")}
          </FormLabel>
          <StyledInput
            id="outlined-basic"
            placeholder={translate(
              "page.games.search.software-provider.placeholder"
            )}
          />
        </FormInputContainer>

        <FormInputContainer>
          <FormLabel>{translate("page.games.search.featured.label")}</FormLabel>
          <StyledInput
            id="outlined-basic"
            placeholder={translate("page.games.search.featured.placeholder")}
          />
        </FormInputContainer>

        <FormInputContainer>
          <FormLabel>{translate("page.games.search.status.label")}</FormLabel>

          <RadioGroup defaultValue="all" name="form-status">
            <FormRow>
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel
                value="active"
                control={<Radio />}
                label={translate("page.games.search.status.labels.active")}
              />
              <FormControlLabel
                value="inactive"
                control={<Radio />}
                label={translate("page.games.search.status.labels.inactive")}
              />
              <FormControlLabel
                value="newly-imported"
                control={<Radio />}
                label={translate(
                  "page.games.search.status.labels.newly-imported"
                )}
              />
            </FormRow>
          </RadioGroup>
        </FormInputContainer>
      </FormContainer>
    </>
  );
};

export default Form;
