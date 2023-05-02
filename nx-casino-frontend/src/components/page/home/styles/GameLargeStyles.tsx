import styled from "styled-components";

export const GameContainer = styled.div`
  width: 345px;
  background-color: #202937;
  border-radius: 10px;

  &:hover .overlay {
    opacity: 1;
  }
`;

export const ImageContainer = styled.div`
  width: 345px;
  height: 234px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
    column-gap: 10px;
    padding: 10px;
    user-select: none;
    background: rgba(46, 57, 73, 0.9);
    background: linear-gradient(
      0deg,
      rgba(46, 57, 73, 0.94) 14%,
      rgba(0, 0, 0, 0) 68%
    );
    transition: 0.3s all ease-in;
  }
`;

export const PlayAction = styled.div`
  cursor: pointer;
  height: 60px;
`;

export const GameName = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  height: 60px;
  display: flex;
  align-items: center;
`;
