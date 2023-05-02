import React from "react";
import styled from "styled-components";

import check from "@assets/check.svg";
import { Controller } from "react-hook-form";

const CheckboxContainer = styled.div`
  position: relative;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    top: 0;
    left: 0;
    opacity: 0;
  }

  input:checked ~ label:before {
    background-color: #414751;
  }

  input:checked ~ label:after {
    opacity: 1;
  }
`;

const CheckboxLabel = styled.label`
  padding-left: 30px;
  display: block;
  position: relative;
  color: #a0a3a8;
  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  cursor: pointer;
  user-select: none;

  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    border: 2px solid #414751;
    left: 0;
    top: 4px;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    left: 0;
    top: 4px;
    opacity: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 65%;
    background-image: url(${check.src});
  }

  a {
    color: #ffd70a;
    text-decoration: none;
  }
`;

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  name: string;
  type?: "checkbox";
};

export function Checkbox({ name, children, ...rest }: InputProps) {
  return (
    <Controller
      name={name}
      render={(renderProps) => {
        return (
          <CheckboxContainer>
            <input
              type="checkbox"
              id={name}
              onChange={renderProps.field.onChange}
              {...rest}
            />
            <CheckboxLabel htmlFor={name}>{children}</CheckboxLabel>
          </CheckboxContainer>
        );
      }}
    />
  );
}
