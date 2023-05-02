import Image from "next/image";
import React from "react";

import PlayButton from "@assets/home/play-button.svg";
import {
  GameContainer as StyledGameContainer,
  GameInfo,
  Status,
  ImageContainer,
  PlayAction,
  PlayCTA,
  GameName,
} from "../styles/GameStyles";

type GameContainerProps = {
  thumbnail: string;
  provider: string;
  status: string;
  cta: string;
  name: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const GameContainer = ({
  thumbnail,
  provider,
  status,
  cta,
  name,
  onClick,
}: GameContainerProps) => {
  return (
    <StyledGameContainer>
      <ImageContainer>
        <Image src={thumbnail} width="220" height="290" alt="" />
        <div className="overlay" onClick={onClick}>
          <PlayAction>
            <Image src={PlayButton} width="60" height="60" alt="Play" />
            <PlayCTA>{cta}</PlayCTA>
          </PlayAction>
          <GameName>{name}</GameName>
        </div>
      </ImageContainer>
      <GameInfo>
        <Image src={provider} width="77" height="27" alt="" />
        <Status>{status}</Status>
      </GameInfo>
    </StyledGameContainer>
  );
};
