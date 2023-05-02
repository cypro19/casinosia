import styled from "styled-components";

export const GameContainer = styled.div`
  width: 220px;
  background-color: #202937;
  border-radius: 10px;

  &:hover .overlay {
    opacity: 1;
  }
`;

export const GameInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

export const Status = styled.div`
  padding: 0 20px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3144e4;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  font-weight: 600;
`;

export const ImageContainer = styled.div`
  width: 220px;
  height: 290px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(46, 57, 73, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    user-select: none;
    opacity: 0;
    transition: 0.3s all ease-in;
  }
`;

export const PlayAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  margin-top: 35%;
  cursor: pointer;
`;

export const PlayCTA = styled.div`
  color: #ffd70a;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
`;

export const GameName = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;
