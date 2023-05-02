import React, { useState } from "react";
import styled from "styled-components";

import LightModeIcon from "@assets/header/LightMode.svg";
import DarkModeIcon from "@assets/header/DarkMode.svg";
import Image from "next/image";

const ThemeToggleContainer = styled.div`
  padding: 0 8px;
  height: 40px;
  display: flex;
  align-items: center;
  column-gap: 10px;
  border-radius: 20px;
  background-color: #141c28;
`;

const ToggleButton = styled.button`
  display: block;
  width: 30px;
  height: 30px;
  border: 0;
  background: transparent;
  cursor: pointer;
  transform: scale(0.75);
  opacity: 0.4;
  transition: 0.3s all ease-in;

  &.active {
    transform: scale(1);
    opacity: 1;
  }
`;

type ThemeProps = {
  themeToggle: (toggle: string) => void;
  status: string;
};

export function ThemeToggle({ themeToggle, status }: ThemeProps) {
  return (
    <ThemeToggleContainer>
      <ToggleButton
        onClick={() => themeToggle("light")}
        className={status == "light" ? "active" : ""}
      >
        <Image
          src={LightModeIcon}
          width="30"
          height="30"
          alt="Light Mode Toggle"
        />
      </ToggleButton>
      <ToggleButton
        onClick={() => themeToggle("dark")}
        className={status == "dark" ? "active" : ""}
      >
        <Image
          src={DarkModeIcon}
          width="30"
          height="30"
          alt="Dark Mode Toggle"
        />
      </ToggleButton>
    </ThemeToggleContainer>
  );
}
