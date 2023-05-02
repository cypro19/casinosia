import React from "react";
import { styled } from "styled-components";

import WinnerPhoto from "@assets/home/winner-photo.png";
import Image from "next/image";

const WinnersContainer = styled.div`
  display: grid;
  gap: 20px;
  user-select: none;
  grid-template-columns: repeat(4, 1fr);
`;

const StyledWinner = styled.div`
  padding: 8px;
  border-radius: 6px;
  background-color: #202937;
  position: relative;

  &::after {
    width: 100%;
    height: 5px;
    content: "";
    display: block;
    position: absolute;
    top: 100%;
    left: 0%;
    background: rgb(226, 193, 10);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(226, 193, 10, 1) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
`;

const ImageContainer = styled.div``;

const WinnerInfo = styled.div`
  text-align: center;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  h2 {
    font-size: 18px;
    font-weight: bold;
  }

  p {
    font-size: 16px;
    margin-top: 10px;
    color: #a6a9af;
  }
`;

const Amount = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: #ffd70a;
`;

type WinnerProps = {
  name: string;
  amount: string;
  game: string;
  image: string;
};

export const Winner = ({ name, amount, game, image }: WinnerProps) => {
  return (
    <StyledWinner>
      <ImageContainer>
        <Image src={image} width="329" height="165" alt="" />
      </ImageContainer>
      <WinnerInfo>
        <h2>{name}</h2>
        <Amount>{amount}</Amount>
        <p>{game}</p>
      </WinnerInfo>
    </StyledWinner>
  );
};

const WinnersArray = [
  {
    name: "Maya just won",
    amount: "$95.882",
    game: "by Gems Bonanza",
    image: WinnerPhoto.src,
  },
  {
    name: "James just won",
    amount: "$21.65",
    game: "by Gems Bonanza",
    image: WinnerPhoto.src,
  },
  {
    name: "Alexandar just won",
    amount: "$5.112",
    game: "by Gonzo’s Quest",
    image: WinnerPhoto.src,
  },
  {
    name: "Julia just won",
    amount: "$4.882",
    game: "by Miss Wildfire",
    image: WinnerPhoto.src,
  },
];

export const LatestWinners = () => {
  return (
    <WinnersContainer>
      {WinnersArray.map((winner, index) => (
        <Winner
          key={index}
          name={winner.name}
          amount={winner.amount}
          game={winner.game}
          image={winner.image}
        ></Winner>
      ))}
    </WinnersContainer>
  );
};
