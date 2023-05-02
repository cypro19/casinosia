import { Wrapper } from "@/components/parts/body/wrapper";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

import Visa from "@assets/home/visa.png";
import Skrill from "@assets/home/skrill.png";
import MasterCard from "@assets/home/mastercard.png";
import Neteller from "@assets/home/neteller.png";
import Klarna from "@assets/home/klarna.png";
import Trustly from "@assets/home/trustly.png";
import EcoPayz from "@assets/home/ecopayz.png";
import MuchBetter from "@assets/home/muchbetter.png";

const LogosContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
`;

export function SectionTwo() {
  return (
    <section>
      <Wrapper>
        <LogosContainer>
          <Image src={Visa} width="104" height="50" alt="Visa"></Image>
          <Image src={Skrill} width="98" height="50" alt="Skrill"></Image>
          <Image
            src={MasterCard}
            width="100"
            height="50"
            alt="MasterCard"
          ></Image>
          <Image src={Neteller} width="140" height="50" alt="Neteller"></Image>
          <Image src={Klarna} width="140" height="50" alt="Klarna"></Image>
          <Image src={Trustly} width="140" height="50" alt="Trustly"></Image>
          <Image src={EcoPayz} width="140" height="50" alt="EcoPayz"></Image>
          <Image
            src={MuchBetter}
            width="140"
            height="50"
            alt="MuchBetter"
          ></Image>
        </LogosContainer>
      </Wrapper>
    </section>
  );
}
