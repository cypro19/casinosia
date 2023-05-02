import React from "react";
import { FormContainer, SearchInput } from "../styles/GameFilterFormStyles";

export function GameFilterForm() {
  return (
    <FormContainer>
      <SearchInput placeholder="Game name or provider" />
    </FormContainer>
  );
}
