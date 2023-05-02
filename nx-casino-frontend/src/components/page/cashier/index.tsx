"use client";

import styled from "styled-components";
import { Page } from "@/components/parts/body/page";

import BackgroundImage from "@assets/home/background-ovals.png";
import ReturnIcon from "@assets/cashier/ReturnIcon.svg";
import Image from "next/image";
import Link from "next/link";

const Background = styled.div`
  background-image: url(${BackgroundImage.src});
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  padding-bottom: 90px;
`;

const Wrapper = styled.div`
  width: 613px;
  margin: 0 auto;
  padding-top: 30px;
`;

const ReturnContainer = styled(Link)`
  display: flex;
  column-gap: 10px;
  cursor: pointer;
  align-items: center;
  text-decoration: none;
  color: brown;

  p {
    font-size: 16px;
    color: #fff;
    font-weight: 600;
  }
`;

export const Cashier = () => {
  return (
    <Background>
      <Page>
        <Wrapper>
          <ReturnContainer href="/my-profile">
            <Image src={ReturnIcon} width="32" height="32" alt="" />
            <p>My Profile</p>
          </ReturnContainer>
        </Wrapper>
      </Page>
    </Background>
  );
};
