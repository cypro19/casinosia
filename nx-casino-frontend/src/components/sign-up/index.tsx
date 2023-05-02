"use client";

import styled from "styled-components";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { StepOne } from "./steps/sign-up-one";
import { StepTwo } from "./steps/sign-up-two";
import { useRegisterUserMutation } from "../graphql/generated-client-api";
import { RegisterUserMutationVariables } from "../graphql/generated-server-api";

const SignUpContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0%;
  width: 100%;
  height: 100vh;
  z-index: 4000;
`;

const SignUpOverlay = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  backdrop-filter: blur(10px);
  z-index: 1;
  background-color: rgba(32, 41, 55, 0.9);
`;

type RegistrationForm = RegisterUserMutationVariables["input"];

export function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registerUser, registrationData] = useRegisterUserMutation();

  const form = useForm<RegistrationForm>({
    mode: "onChange",
    values: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "bulgaria",
      city: "",
      gender: "male",
      currency: "eur",
      address: "",
      birthDate: 0,
    },
  });

  console.log(registrationData);

  const onSubmit = React.useCallback((data: RegistrationForm) => {
    registerUser({
      variables: {
        input: {
          firstName: data.firstName,
          email: data.email,
          lastName: data.lastName,
          password: data.password,
          country: data.country,
          city: data.city,
          address: data.address,
          gender: data.gender,
          currency: data.currency,
          birthDate: data.birthDate,
        },
      },
    });
  }, []);

  let currentStepComponent;

  if (currentStep === 1) {
    currentStepComponent = <StepOne changeStep={setCurrentStep} />;
  } else if (currentStep === 2) {
    currentStepComponent = <StepTwo changeStep={setCurrentStep} />;
  }

  return (
    <SignUpContainer>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SignUpOverlay>{currentStepComponent}</SignUpOverlay>
        </form>
      </FormProvider>
    </SignUpContainer>
  );
}
