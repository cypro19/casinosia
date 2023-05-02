import React from "react";
import { styled } from "styled-components";
import { LargeGameContainer } from "./GameLargeContainer";

import GameThumbnail from "@assets/home/game-thumbnail-2.png";

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

const GamesArray = [
  {
    icon: GameThumbnail.src,
    name: "Raptor, Doublemax",
  },
  {
    icon: GameThumbnail.src,
    name: "The Wisecracker, Lightning",
  },
  {
    icon: GameThumbnail.src,
    name: "Jammin’ Jars 2",
  },
  {
    icon: GameThumbnail.src,
    name: "Rise of Giza, PowerNudge",
  },
];
export const BestNewcomers = () => {
  return (
    <StyledGamesContainer>
      {GamesArray.map((game, index) => (
        <LargeGameContainer
          key={index}
          thumbnail={game.icon}
          name={game.name}
        />
      ))}
    </StyledGamesContainer>
  );
};
