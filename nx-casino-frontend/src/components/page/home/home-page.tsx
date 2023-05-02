"use client";

import styled from "styled-components";
import { Page } from "@/components/parts/body/page";
import { SectionOne } from "@/components/page/home/section1";
import { SectionTwo } from "@/components/page/home/section2";
import { SectionThree } from "@/components/page/home/section3";
import { SectionFour } from "@/components/page/home/section4";
import { SectionFive } from "@/components/page/home/section5";

import BackgroundImage from "@assets/home/background-ovals.png";
import { ListGamesQuery } from "@/components/graphql/generated-server-api";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/components/graphql/client-csr";
import StyledComponentsRegistry from "@/app/registry";

const Background = styled.div`
  background-image: url(${BackgroundImage.src});
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
`;

type HomePageProps = {
  popularGames: ListGamesQuery["games"];
};

export const HomePage = (props: HomePageProps) => {
  const client = useApollo();

  return (
    <StyledComponentsRegistry>
      <ApolloProvider client={client}>
        <Page>
          <Background>
            <SectionOne />
            <SectionTwo />
            <SectionThree />
            <SectionFour popularGamesArray={props.popularGames} />
            <SectionFive />
          </Background>
        </Page>
      </ApolloProvider>
    </StyledComponentsRegistry>
  );
};
