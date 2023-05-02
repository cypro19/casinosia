import React from "react";
import { styled } from "styled-components";
import { Wrapper } from "@/components/parts/body/wrapper";
import { Section } from "./parts/Section";
import { Megaways } from "./parts/Megaways";

import DoubleDragon from "@assets/home/double_dragons.png";
import MegaWaysIcon from "@assets/home/megaways-icon.svg";

const StyledContainer = styled.div`
  background-image: url(${DoubleDragon.src});
  background-size: 100%;
  background-position: center;
`;

export function SectionFive() {
  return (
    <StyledContainer>
      <Wrapper>
        <Section title="Megaways" icon={MegaWaysIcon.src}>
          <Megaways />
        </Section>
      </Wrapper>
    </StyledContainer>
  );
}
