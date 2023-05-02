import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: 100%;
  height: 54px;
  background-color: #ffd809;
  font-family: inherit;
  font-weight: 600;
  font-size: 16px;
  color: #121925;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  cursor: pointer;
  border-radius: 27px;
  transition: 0.3s all ease-in;

  &:hover {
    border-color: #ffd809;
    color: #ffd809;
    background-color: #121925;
  }
`;

const StyledButtonContainer = styled.div.attrs(
  (props: { direction: string }) => props
)`
  width: 100%;
  display: flex;
  justify-content: ${(props) =>
    props.direction == "center"
      ? "center"
      : props.direction == "end"
      ? "flex-end"
      : "flex-start"};
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...buttonProps }: ButtonProps) {
  return <StyledButton {...buttonProps}>{children}</StyledButton>;
}

interface ButtonContainerProps {
  children: React.ReactNode;
  direction?: string;
}

export function ButtonContainer({ children, direction }: ButtonContainerProps) {
  return (
    <StyledButtonContainer direction={direction}>
      {children}
    </StyledButtonContainer>
  );
}
