import React from "react";
import { useTranslate } from "@pankod/refine-core";
import {
  ColorButton,
  FormContainer,
  FormInputContainer,
  FormInputRow,
  FormWrapper,
  MainForm,
  StyledFormLabel,
  StyledInput,
} from "./form-components";
import MultipleSelect from "../multiple-select";

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

export const Form = () => {
  const translate = useTranslate();

  return (
    <MainForm>
      <>
        <FormWrapper sx={{ flexGrow: 1 }}>
          <FormContainer sx={{ flex: 1 }}>
            <FormInputContainer>
              <StyledFormLabel htmlFor="players_search">
                {translate("page.players.search.search.label")}
              </StyledFormLabel>
              <StyledInput
                id="players_search"
                color="info"
                variant="outlined"
                size="small"
                placeholder={translate(
                  "page.players.search.search.placeholder"
                )}
              />
            </FormInputContainer>
            <FormInputContainer sx={{ flex: 1, paddingRight: "2.7rem" }}>
              <StyledFormLabel>
                {translate("page.players.search.receivedBonus.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
            <FormInputRow sx={{ flex: 1 }}>
              <FormInputContainer sx={{ flex: 1 }}>
                <StyledFormLabel htmlFor="players_balancefrom">
                  {translate("page.players.search.balanceFrom.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_balancefrom"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.balanceFrom.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer sx={{ flex: 1 }}>
                <StyledFormLabel htmlFor="players_balancetill">
                  {translate("page.players.search.balanceTill.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_balancetill"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.balanceTill.placeholder"
                  )}
                />
              </FormInputContainer>
            </FormInputRow>
            <FormInputContainer sx={{ flex: 1, paddingRight: "2.7rem" }}>
              <StyledFormLabel>
                {translate("page.players.search.manager.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
          </FormContainer>
          <FormContainer sx={{ flex: 2 }}>
            <FormInputContainer sx={{ flex: 1 }}>
              <StyledFormLabel>
                {translate("page.players.search.country.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
            <FormInputRow>
              <FormInputContainer sx={{ flex: 1 }}>
                <StyledFormLabel htmlFor="players_gamesplayed">
                  {translate("page.players.search.gamesPlayed.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_gamesplayed"
                  margin="none"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.gamesPlayed.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer sx={{ flex: 1 }}>
                <StyledFormLabel>
                  {translate("page.players.search.tag.label")}
                </StyledFormLabel>
                <MultipleSelect names={names} />
              </FormInputContainer>
            </FormInputRow>
            <FormInputRow>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_depositsfrom">
                  {translate("page.players.search.depositsFrom.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_depositsfrom"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.depositsFrom.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_depositstill">
                  {translate("page.players.search.depositsTill.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_depositstill"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.depositsTill.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_withdrawlfrom">
                  {translate("page.players.search.withdrawlFrom.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_withdrawlfrom"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.withdrawlFrom.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_withdrawltill">
                  {translate("page.players.search.withdrawlTill.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_withdrawltill"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.withdrawlTill.placeholder"
                  )}
                />
              </FormInputContainer>
            </FormInputRow>
            <FormInputRow>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_registeredfrom">
                  {translate("page.players.search.registeredFrom.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_registeredfrom"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.registeredFrom.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_registeredto">
                  {translate("page.players.search.registeredTo.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_registeredto"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.registeredTo.placeholder"
                  )}
                />
              </FormInputContainer>
            </FormInputRow>
          </FormContainer>
          <FormContainer sx={{ flex: 1 }}>
            <FormInputContainer>
              <StyledFormLabel>
                {translate("page.players.search.profileStatus.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
            <FormInputContainer>
              <StyledFormLabel>
                {translate("page.players.search.group.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
            <FormInputRow>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_pointsfrom">
                  {translate("page.players.search.pointsFrom.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_pointsfrom"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.pointsFrom.placeholder"
                  )}
                />
              </FormInputContainer>
              <FormInputContainer>
                <StyledFormLabel htmlFor="players_pointstill">
                  {translate("page.players.search.pointsTill.label")}
                </StyledFormLabel>
                <StyledInput
                  id="players_pointstill"
                  color="info"
                  variant="outlined"
                  size="small"
                  placeholder={translate(
                    "page.players.search.pointsTill.placeholder"
                  )}
                />
              </FormInputContainer>
            </FormInputRow>
            <FormInputContainer>
              <StyledFormLabel>
                {translate("page.players.search.optInBySms.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
          </FormContainer>
          <FormContainer sx={{ flex: 1 }}>
            <FormInputContainer>
              <StyledFormLabel>
                {translate("page.players.search.exclusionStatus.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
            <FormInputContainer>
              <StyledFormLabel>
                {translate("page.players.search.currency.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
            <FormInputContainer>
              <StyledFormLabel htmlFor="players_affiliate">
                {translate("page.players.search.affiliate.label")}
              </StyledFormLabel>
              <StyledInput
                id="players_affiliate"
                color="info"
                variant="outlined"
                size="small"
                placeholder={translate(
                  "page.players.search.affiliate.placeholder"
                )}
              />
            </FormInputContainer>
            <FormInputContainer>
              <StyledFormLabel>
                {translate("page.players.search.optInByEmail.label")}
              </StyledFormLabel>
              <MultipleSelect names={names} />
            </FormInputContainer>
          </FormContainer>
        </FormWrapper>
        <ColorButton variant="contained" sx={{ flex: 1 }}>
          {translate("page.players.buttons.submit")}
        </ColorButton>
      </>
    </MainForm>
  );
};
