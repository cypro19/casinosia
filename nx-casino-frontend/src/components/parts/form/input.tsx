import React from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";

const StyledLabel = styled.label`
  color: #8c9098;
  font-size: 15px;
  font-weight: 400;
  user-select: none;
  cursor: pointer;
`;

const StyledInput = styled.input`
  height: 50px;
  width: 100%;
  background-color: #202937;
  border-radius: 4px;
  padding: 0 16px;
  color: #fff;
  font-family: inherit;
  font-weight: 400;
  border: 0;
  outline: 0;
  font-size: 14px;

  &::placeholder {
    font-family: inherit;
    color: #969696;
  }
`;

const StyledInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
`;

const StyledInputRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
`;

export function Label({
  children,
  labelFor,
}: {
  children: React.ReactNode;
  labelFor?: string;
}) {
  return <StyledLabel htmlFor={labelFor}>{children}</StyledLabel>;
}

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
};

export function Input({ name, ...rest }: InputProps) {
  return (
    <Controller
      name={name}
      render={(renderProps) => {
        return <StyledInput {...rest} onChange={renderProps.field.onChange} />;
      }}
    />
  );
}

export function InputContainer({ children }: { children: React.ReactNode }) {
  return <StyledInputContainer>{children}</StyledInputContainer>;
}

export function InputRow({ children }: { children: React.ReactNode }) {
  return <StyledInputRow>{children}</StyledInputRow>;
}
