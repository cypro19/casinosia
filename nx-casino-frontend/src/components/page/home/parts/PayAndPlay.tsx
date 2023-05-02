"use client";

import React, { useState } from "react";
import { Input, InputContainer, Label } from "@/components/parts/form/input";
import Link from "next/link";
import Image from "next/image";
import Trustly from "@assets/home/trustly.png";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/parts/form/button";

import {
  PayAndPlayContainer,
  Header,
  MinMaxMain,
  MinMaxContainer,
  ValueButtonContainer,
  ValuePresetButton,
} from "../styles/PayAndPlayStyles";

const MinMax = () => {
  const [amount, setAmount] = useState(0);

  function increaseAmount(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const newAmount = amount + 10;
    setAmount(newAmount);
  }

  function decreaseAmount(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const newAmount = amount - 10;
    setAmount(Math.max(newAmount, 0));
  }

  return (
    <MinMaxMain>
      <InputContainer>
        <Label>Enter Amount</Label>
        <MinMaxContainer>
          <button onClick={decreaseAmount}>-</button>
          <Input
            type="text"
            name="amount"
            min="1"
            placeholder="$50"
            value={"$" + amount}
          />
          <button onClick={increaseAmount}>+</button>
        </MinMaxContainer>
      </InputContainer>
      <ValueButtonContainer>
        <ValuePresetButton
          onClick={(event) => {
            event.preventDefault();
            setAmount(25);
          }}
        >
          $25
        </ValuePresetButton>
        <ValuePresetButton
          onClick={(event) => {
            event.preventDefault();
            setAmount(50);
          }}
        >
          $50
        </ValuePresetButton>
        <ValuePresetButton
          onClick={(event) => {
            event.preventDefault();
            setAmount(100);
          }}
        >
          $100
        </ValuePresetButton>
      </ValueButtonContainer>
    </MinMaxMain>
  );
};

export const PayAndPlay = () => {
  const form = useForm({
    mode: "onChange",
    values: {
      amount: 0,
    },
  });

  return (
    <PayAndPlayContainer>
      <Header>
        <h2>
          Sign Up With <br />
          <span>Pay And Play</span>
        </h2>
        <Image src={Trustly} width="94" height="30" alt="Trustly" />
      </Header>
      <FormProvider {...form}>
        <form>
          <MinMax />
          <Button>START PLAYING</Button>
          <Link href="#">or Login with Pay and Play</Link>
        </form>
      </FormProvider>
    </PayAndPlayContainer>
  );
};
