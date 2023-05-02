"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

import Logo from "@assets/logo.png";

import { Wrapper } from "@components/parts/body/wrapper";
import { ThemeToggle } from "@/components/header/parts/theme-toggle";

const HeaderContainer = styled.header`
  width: 100%;
  padding: 25px 0;
  position: fixed;
  top: 0;
  z-index: 5000;
  background-color: #25303c;

  .flex-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .logo_container {
    align-self: center;

    img {
      height: 26px;
      width: auto;
    }
  }

  .center_container {
    align-self: center;
    justify-self: center;

    nav {
      display: flex;
      column-gap: 30px;
    }
  }

  .right_container {
    align-self: center;
    align-items: center;
    justify-self: end;
    display: flex;
    column-gap: 30px;

    .sign_up_button {
      background-color: #ffd809;
      box-shadow: 0 0 10px 0 rgba(255, 214, 10, 0.4);
      display: flex;
      height: 40px;
      padding: 0 32px;
      justify-content: center;
      align-items: center;
      color: #121925;
      border-radius: 20px;
    }
  }

  a {
    font-size: 16px;
    text-decoration: none;
    font-weight: 600;
    color: #dedfe4;
  }

  .sign-up-cta {
    background-color: #ffd808;
    display: flex;
    padding: 0 32px;
    height: 40px;
    color: #202937;
    border-radius: 20px;
    align-items: center;
    box-shadow: 0px 2px 10px rgba(255, 214, 10, 0.4);
  }
`;

type HeaderProps = {
  themeToggle: (toggle: string) => void;
  themeStatus: string;
};

export function Header({ themeToggle, themeStatus }: HeaderProps) {
  const AuthenticatedButtons = () => {
    if (false) {
      return <Link href="#">Sign Out</Link>;
    } else {
      return (
        <>
          <Link className="login_button" href="/">
            Login
          </Link>
          <Link href="/sign-up" className="sign-up-cta">
            Sign Up
          </Link>
        </>
      );
    }
  };

  return (
    <HeaderContainer>
      <Wrapper className="flex-container">
        <div className="logo_container">
          <Link href="/">
            <Image src={Logo} alt="Slototop" />
          </Link>
        </div>
        <div className="center_container">
          <nav>
            <Link href="/">Promotions</Link>
            <Link href="/">Tournaments</Link>
            <Link href="/">VIP</Link>
            <Link href="/">Info</Link>
            <Link href="/">Contacts</Link>
          </nav>
        </div>
        <div className="right_container">
          <ThemeToggle themeToggle={themeToggle} status={themeStatus} />
          <AuthenticatedButtons />
        </div>
      </Wrapper>
    </HeaderContainer>
  );
}
