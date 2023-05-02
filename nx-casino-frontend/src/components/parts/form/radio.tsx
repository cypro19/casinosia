import React from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";

const RadioContainer = styled.div`
  border: 2px solid #414751;
  height: 50px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  position: relative;

  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  input:checked ~ label {
    color: #fff;

    &::before {
      border: 3px solid #ffd70a;
      background: #414751;
    }
  }
`;

const RadioLabel = styled.label`
  padding-left: 26px;
  font-size: 16px;
  color: #414751;
  font-family: inherit;
  display: block;
  position: relative;
  cursor: pointer;

  &::before {
    content: "";
    width: 16px;
    height: 16px;
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    border: 2px solid #414751;
  }
`;

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  type?: "radio";
};

// TODO: add radio groups
export function Radio({ name, value, children, ...rest }: InputProps) {
  return (
    <Controller
      name={name}
      render={(renderProps) => {
        return (
          <RadioContainer>
            <input
              {...rest}
              type="radio"
              id={`${name}-${value}`}
              onChange={() => renderProps.field.onChange(value)}
              name={name}
            />
            <RadioLabel htmlFor={`${name}-${value}`}>{children}</RadioLabel>
          </RadioContainer>
        );
      }}
    />
  );
}
