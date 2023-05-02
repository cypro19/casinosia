import { StyledFormDiv } from "@/components/parts/form";
import { Button } from "@/components/parts/form/button";
import { Checkbox } from "@/components/parts/form/checkbox";
import {
  Input,
  InputContainer,
  InputRow,
  Label,
} from "@/components/parts/form/input";
import { Radio } from "@/components/parts/form/radio";
import { Title } from "@/components/parts/form/title";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const StepContainer = styled.div`
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: fit-content;
  background-color: #121925;
  border-radius: 10px;
  padding: 40px;

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

type StepTwoProps = {
  changeStep: (step: number) => void;
};

export function StepTwo(props: StepTwoProps) {
  const handlePrev = () => {
    props.changeStep(1);
  };

  return (
    <>
      <StepContainer>
        <Title>Profile Details</Title>
        <StyledFormDiv>
          <InputRow>
            <InputContainer>
              <Label labelFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="firstName"
                type="text"
                placeholder="Enter your name"
              />
            </InputContainer>

            <InputContainer>
              <Label labelFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
              />
            </InputContainer>
          </InputRow>

          <InputRow>
            <InputContainer>
              <Label labelFor="date_of_birth">Date of birth</Label>
              <Input
                id="date_of_birth"
                name="birthDate"
                type="date"
                placeholder="DD / MM / YY"
              />
            </InputContainer>

            <InputContainer>
              <Label labelFor="city">City*</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city"
              />
            </InputContainer>
          </InputRow>

          <InputContainer>
            <Label labelFor="address">Address*</Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Street address"
            />
          </InputContainer>

          <InputRow>
            <Radio name="gender" value="male">
              Male
            </Radio>
            <Radio name="gender" value="female">
              Female
            </Radio>
          </InputRow>

          <InputContainer>
            <Checkbox name="toc_acceptance">
              I’m at least 18 years old and I accept the{" "}
              <a href="/privacy">Privacy Policy</a> and{" "}
              <a href="/terms">Terms & Conditions</a>
            </Checkbox>
          </InputContainer>
          <Button type="submit">Join Us</Button>
          <div>
            <p>
              Already have an account? <a href="/login">Log in</a> or{" "}
              <Link href="#" onClick={handlePrev}>
                Go back
              </Link>
            </p>
          </div>
        </StyledFormDiv>
      </StepContainer>
    </>
  );
}
