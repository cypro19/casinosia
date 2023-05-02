import React from "react";
import styled from "styled-components";
import Image from "next/image";

import Banner from "@assets/sign_up/banner.png";
import {
  Input,
  InputContainer,
  InputRow,
  Label,
} from "@/components/parts/form/input";
import { StyledFormDiv } from "@/components/parts/form";
import { Title } from "@/components/parts/form/title";
import { Select } from "@/components/parts/form/select";
import { Button } from "@/components/parts/form/button";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

const StepContainer = styled.div`
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 960px;
  height: 520px;
  background-color: #121925;
  border-radius: 10px;

  #login_notice {
    text-align: center;

    p {
      color: #a0a3a8;
      font-size: 15px;

      a {
        color: #ffd809;
        text-decoration: none;
      }
    }
  }
`;

const LeftContainer = styled.div``;

const RightContainer = styled.div`
  padding: 40px;
`;

type StepOneProps = {
  changeStep: (step: number) => void;
};

export function StepOne(props: StepOneProps) {
  const handleNext = () => props.changeStep(2);
  const methods = useFormContext();

  return (
    <>
      <StepContainer>
        <LeftContainer>
          <Image src={Banner} alt="Welcome Package 150%" />
        </LeftContainer>
        <RightContainer>
          <StyledFormDiv>
            <Title>CREATE AN ACCOUNT</Title>
            <InputContainer>
              <Label labelFor="email_address">Email*</Label>
              <Input
                id="email_address"
                name="email"
                type="email"
                placeholder="ex. jonh_doe@gmai.bg"
              />
            </InputContainer>

            <InputContainer>
              <Label labelFor="password">Password*</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="at least 6 symbols + 1 special char"
              />
            </InputContainer>

            <InputRow>
              <InputContainer>
                <Label labelFor="country">Country*</Label>
                <Select name="country" id="country">
                  <option value="bulgaria">Bulgaria</option>
                </Select>
              </InputContainer>

              <InputContainer>
                <Label labelFor="currency">Currency*</Label>
                <Select name="currency" id="currency">
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                </Select>
              </InputContainer>
            </InputRow>

            <Button onClick={handleNext}>Next Step</Button>

            <div id="login_notice">
              <p>
                Already have an account? <Link href="/login">Log in</Link>
              </p>
            </div>
          </StyledFormDiv>
        </RightContainer>
      </StepContainer>
    </>
  );
}
