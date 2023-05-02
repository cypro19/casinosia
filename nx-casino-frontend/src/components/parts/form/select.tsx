import React from "react";
import { Controller } from "react-hook-form";
import styled from "styled-components";

const SelectContainer = styled.div`
  position: relative;

  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    pointer-events: none;

    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 4px 0 4px;
    border-color: #797f87 transparent transparent transparent;
  }
`;

const StyledSelect = styled.select`
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
  cursor: pointer;
  appearance: none;
`;

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
};

export function Select({ name, children, ...rest }: SelectProps) {
  return (
    <Controller
      name={name}
      render={(renderProps) => {
        return (
          <SelectContainer>
            <StyledSelect
              defaultValue={renderProps.field.value}
              {...rest}
              onChange={renderProps.field.onChange}
            >
              {children}
            </StyledSelect>
          </SelectContainer>
        );
      }}
    />
  );
}
