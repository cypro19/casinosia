import { styled } from "styled-components";

export const ButtonContainer = styled.div`
  display: flex;
  column-gap: 40px;
  align-items: center;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  column-gap: 8px;
  background: transparent;
  border: 0;
  font-family: inherit;
  font-weight: 500;
  color: #b5b7bf;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s all ease-in;

  &:hover {
    color: #fff;
  }

  .realign {
    transform: translateY(3px);
  }
`;
