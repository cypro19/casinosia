import React from "react";
import { styled } from "styled-components";
import { GameType } from "../section4";
import { GameContainer } from "./GameContainer";

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

type PopularGamesProps = {
  games: GameType[];
};

export const PopularGames = (props: PopularGamesProps) => {
  return (
    <StyledGamesContainer>
      {props.games.map((game) => (
        <GameContainer
          key={game.id}
          thumbnail={game.icon}
          provider={game.provider}
          status={game.status}
          cta={game.cta}
          name={game.name}
        />
      ))}
    </StyledGamesContainer>
  );
};
