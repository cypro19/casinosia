import React from "react";
import Image from "next/image";
import { styled } from "styled-components";

import NetentLogo from "@assets/home/netent-logo.png";

const StyledGamesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 40px;
  justify-content: space-between;

  > div {
    flex-shrink: 0;
  }
`;

const ImageContainer = styled.div`
  width: 220px;
  height: 70px;
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: #3a3e54;
`;

const GameProvidersArray = [
  {
    name: "Neten",
    image: NetentLogo,
  },
  {
    name: "Neten",
    image: NetentLogo,
  },
  {
    name: "Neten",
    image: NetentLogo,
  },
  {
    name: "Neten",
    image: NetentLogo,
  },
  {
    name: "Neten",
    image: NetentLogo,
  },
  {
    name: "Neten",
    image: NetentLogo,
  },
];

export const GameProviders = () => {
  return (
    <StyledGamesContainer>
      {GameProvidersArray.map((game, index) => (
        <ImageContainer key={index}>
          <Image src={game.image} height="48" width="111" alt={game.name} />
        </ImageContainer>
      ))}
    </StyledGamesContainer>
  );
};
