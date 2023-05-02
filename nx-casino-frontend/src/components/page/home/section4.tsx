import React from "react";

import { Section } from "./parts/Section";
import { Wrapper } from "@/components/parts/body/wrapper";

import PopularIcon from "@assets/home/popular-icon.svg";
import GamesProviderIcon from "@assets/home/game-provider-icon.svg";
import BestNewComerIcon from "@assets/home/best-new-comer-icon.svg";
import LatestWinnersIcon from "@assets/home/latest-winner-icon.svg";

import { PopularGames } from "./parts/PopularGames";
import { GameProviders } from "./parts/GameProviders";
import { BestNewcomers } from "./parts/BestNewcomers";
import { LatestWinners } from "./parts/Winner";

export type GameType = {
  id: string;
  icon: string;
  provider: string;
  cta: string;
  name: string;
  status: string;
};

type SectionFourProps = {
  popularGamesArray: GameType[];
};

export function SectionFour(props: SectionFourProps) {
  return (
    <Wrapper>
      <Section title="Popular" icon={PopularIcon.src}>
        <PopularGames games={props.popularGamesArray} />
      </Section>
      <Section title="Games Provider" icon={GamesProviderIcon.src}>
        <GameProviders />
      </Section>
      <Section title="Best Newcomers" icon={BestNewComerIcon.src}>
        <BestNewcomers />
      </Section>
      <Section title="Latest Winners" icon={LatestWinnersIcon.src}>
        <LatestWinners />
      </Section>
    </Wrapper>
  );
}
