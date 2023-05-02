import React from "react";
import styled from "styled-components";

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

export function StyledFormDiv({
  children,
  ...rest
}: React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return <StyledForm {...rest}>{children}</StyledForm>;
}
