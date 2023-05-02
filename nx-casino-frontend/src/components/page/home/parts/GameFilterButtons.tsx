import Image from "next/image";
import React from "react";

import { ButtonContainer, Button } from "../styles/GameFilterButtonStyles";

import PopularButtonIcon from "@assets/home/popular-button-icon.svg";
import NewButtonIcon from "@assets/home/new-button-icon.svg";
import SlotsButtonIcon from "@assets/home/slots-button-icon.svg";
import JackpotButtonIcon from "@assets/home/jackpot-button-icon.svg";
import CasinoButtonIcon from "@assets/home/casino-button-icon.svg";
import DropButtonIcon from "@assets/home/drop-button-icon.svg";

export function GameFilterButtons() {
  return (
    <ButtonContainer>
      <Button>
        <Image
          src={PopularButtonIcon}
          width="22"
          height="22"
          alt=""
          className="realign"
        />
        <span>Popular</span>
      </Button>
      <Button>
        <Image src={NewButtonIcon} width="18" height="18" alt="" />
        <span>New</span>
      </Button>
      <Button>
        <Image src={SlotsButtonIcon} width="18" height="18" alt="" />
        <span>Slots</span>
      </Button>
      <Button>
        <Image src={JackpotButtonIcon} width="22" height="22" alt="" />
        <span>Jackpots</span>
      </Button>
      <Button>
        <Image src={CasinoButtonIcon} width="18" height="18" alt="" />
        <span>Live Casino</span>
      </Button>
      <Button>
        <Image src={DropButtonIcon} width="18" height="18" alt="" />
        <span>Drop & Wins</span>
      </Button>
    </ButtonContainer>
  );
}
