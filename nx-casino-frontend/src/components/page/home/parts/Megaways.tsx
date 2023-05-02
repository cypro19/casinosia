import React from "react";
import styled from "styled-components";
import Image from "next/image";

import GameThumbnail from "@assets/home/game-thumbnail.png";
import PlayButton from "@assets/home/play-button.svg";

const StyledContainer = styled.div`
  display: flex;
  column-gap: 20px;
  flex-wrap: nowrap;
`;

const GameContainer = styled.div`
  flex: 1 1 auto;
  background-color: #202937;
  border-radius: 6px;
  transition: 0.3s all ease-in;
  position: relative;
  height: 358px;

  &:hover {
    flex-grow: 2;

    .overlay {
      opacity: 1;
    }
  }
`;

const ImageContainer = styled.div<{ thumbnail: string }>`
  background-image: url(${(props) => props.thumbnail});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 358px;
  position: absolute;
  top: 0;
  left: 0%;
  z-index: 1;
  border-radius: 6px;
  overflow: hidden;

  .overlay {
    width: 100%;
    height: 358px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(46, 57, 73, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 35px;
    padding: 30px 0;
    user-select: none;
    opacity: 0;
    transition: 0.3s all ease-in;
  }
`;

const PlayAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  cursor: pointer;
`;

const PlayCTA = styled.div`
  color: #ffd70a;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
`;

const GameName = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  p {
    font-size: 14px;
    font-weight: 300;
    text-align: center;
    margin-bottom: 10px;
  }
`;

type GameProps = {
  thumbnail: string;
  cta: string;
  name: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const Game = ({ thumbnail, cta, name, onClick }: GameProps) => {
  return (
    <GameContainer>
      <ImageContainer thumbnail={thumbnail}>
        <div className="overlay" onClick={onClick}>
          <PlayAction>
            <Image src={PlayButton} width="60" height="60" alt="Play" />
            <PlayCTA>{cta}</PlayCTA>
          </PlayAction>

          <GameName>
            <p>Pragmatic Play</p>
            <span>{name}</span>
          </GameName>
        </div>
      </ImageContainer>
    </GameContainer>
  );
};

const MegawayArray = [
  {
    thumbnail: GameThumbnail.src,
    cta: "PLAY FOR FUN",
    name: "Gems Bonanza",
  },
  {
    thumbnail: GameThumbnail.src,
    cta: "PLAY FOR FUN",
    name: "Gems Bonanza",
  },
  {
    thumbnail: GameThumbnail.src,
    cta: "PLAY FOR FUN",
    name: "Gems Bonanza",
  },
  {
    thumbnail: GameThumbnail.src,
    cta: "PLAY FOR FUN",
    name: "Gems Bonanza",
  },
  {
    thumbnail: GameThumbnail.src,
    cta: "PLAY FOR FUN",
    name: "Gems Bonanza",
  },
];

export const Megaways = () => {
  return (
    <StyledContainer>
      {MegawayArray.map((game, index) => (
        <Game
          key={index}
          thumbnail={game.thumbnail}
          cta={game.cta}
          name={game.name}
        />
      ))}
    </StyledContainer>
  );
};
