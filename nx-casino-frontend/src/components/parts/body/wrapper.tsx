import React from "react";
import styled from "styled-components";

const WrapperContainer = styled.div`
  width: 1440px;
  margin: 0 auto;
`;

export function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <WrapperContainer className={className}>{children}</WrapperContainer>;
}
