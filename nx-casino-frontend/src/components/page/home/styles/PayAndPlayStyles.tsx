import styled from "styled-components";
import { Button } from "@/components/parts/form/button";

export const PayAndPlayContainer = styled.div`
  width: 400px;
  padding: 35px;
  background-color: #29313e;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 -4px 10px 0 rgba(19, 22, 37, 0.1);
  display: flex;
  flex-direction: column;
  row-gap: 45px;
  transform: translateY(-20px);

  a {
    color: #a8abb2;
    text-align: center;
    text-decoration: none;
    font-size: 12px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;

    span {
      color: #ffd809;
    }
  }
`;

export const MinMaxMain = styled.div`
  margin-bottom: 30px;
`;

export const MinMaxContainer = styled.div`
  display: flex;
  background-color: #465163;
  height: 55px;
  border-radius: 4px;
  margin-bottom: 14px;

  button {
    width: 50px;
    height: inherit;
    font-size: 20px;
    color: #fff;
    background-color: transparent;
    border: 0;
    outline: 0;
    font-family: inherit;
    font-weight: 400;
    cursor: pointer;
    flex-shrink: 0;
  }

  input {
    font-family: inherit;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    background: transparent;
    height: inherit;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &::placeholder {
      font-family: inherit;
      color: #fff;
      font-size: inherit;
      font-weight: bold;
    }
  }
`;

export const ValueButtonContainer = styled.div`
  column-gap: 14px;
  display: flex;
`;

export const ValuePresetButton = styled(Button)`
  background: #465163;
  border: 0;
  border-radius: 4px;
  color: #fff;
  height: 40px;
  font-size: 14px;

  &:hover,
  .selected {
    background-color: #a1afc5;
    font-weight: bold;
    color: #fff;
  }
`;
