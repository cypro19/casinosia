import React from "react";
import styled from "styled-components";
import { Wrapper } from "../parts/body/wrapper";

const FooterWrapper = styled(Wrapper)`
  display: flex;
`;

// TODO: add sections to footer
export const Footer = () => {
  return (
    <footer>
      <FooterWrapper>
        <div>Section A</div>
        <div>Section B</div>
        <div>Section C</div>
        <div>Section D</div>
      </FooterWrapper>
    </footer>
  );
};
