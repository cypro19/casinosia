import Image from "next/image";
import React from "react";

import {
  GameContainer,
  ImageContainer,
  PlayAction,
  GameName,
} from "../styles/GameLargeStyles";

import PlayButton from "@assets/home/play-button.svg";

type GameProps = {
  thumbnail: string;
  name: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const LargeGameContainer = ({ thumbnail, name, onClick }: GameProps) => {
  return (
    <GameContainer>
      <ImageContainer>
        <Image src={thumbnail} width="345" height="234" alt="" />
        <div className="overlay" onClick={onClick}>
          <PlayAction>
            <Image src={PlayButton} width="60" height="60" alt="Play" />
          </PlayAction>
          <GameName>{name}</GameName>
        </div>
      </ImageContainer>
    </GameContainer>
  );
};
