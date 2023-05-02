import { Wrapper } from "@/components/parts/body/wrapper";
import React from "react";
import { styled } from "styled-components";
import { GameFilterButtons } from "./parts/GameFilterButtons";
import { GameFilterForm } from "./parts/GameFilterForm";

const StyledSection = styled.section`
  border-top: 1px solid #485261;
  border-bottom: 1px solid #485261;
  padding: 15px 0;
`;

const StyledWrapper = styled(Wrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function SectionThree() {
  return (
    <StyledSection>
      <StyledWrapper>
        <GameFilterForm />
        <GameFilterButtons />
      </StyledWrapper>
    </StyledSection>
  );
}
