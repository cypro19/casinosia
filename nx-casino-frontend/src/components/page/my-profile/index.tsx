"use client";

import styled from "styled-components";
import { Page } from "@/components/parts/body/page";
import { InputRow } from "@/components/parts/form/input";

import { WalletInfo } from "./parts/WalletInfo";
import { ProfileInfo } from "./parts/ProfileInfo";
import { VerifyIdentity } from "./parts/VerifyIdentity";
import { ChangePassword } from "./parts/ChangePassword";
import { ChangeEmail } from "./parts/ChangeEmail";
import { ResponsibleGaming } from "./parts/ResponsibleGaming";

import BackgroundImage from "@assets/Background.png";

const Background = styled.div`
  background-image: url(${BackgroundImage.src});
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  padding-bottom: 90px;
`;

const Wrapper = styled.div`
  width: 960px;
  margin: 0 auto;
`;

const Section = styled.section`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  h1.title {
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    color: #fff;
  }
`;

export const Profile = () => {
  return (
    <Background>
      <Page>
        <Wrapper>
          <Section>
            <h1 className="title">Wallet Info</h1>
            <WalletInfo />
          </Section>
          <Section>
            <h1 className="title">Profile Info</h1>
            <ProfileInfo />
            <VerifyIdentity />
            <InputRow>
              <ChangePassword />
              <ChangeEmail />
            </InputRow>
            <ResponsibleGaming />
          </Section>
        </Wrapper>
      </Page>
    </Background>
  );
};
