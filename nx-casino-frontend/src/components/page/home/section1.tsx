import { Wrapper } from "@/components/parts/body/wrapper";
import React from "react";
import styled from "styled-components";
import { PayAndPlay } from "./parts/PayAndPlay";
import HeaderBackground from "@assets/home/header_image.png";
import {
  useLoginUserLazyQuery,
  useLogoutLazyQuery,
} from "@/components/graphql/generated-client-api";

const Section = styled.section`
  h1 {
    text-align: center;
    font-size: 45px;
    text-transform: uppercase;
    margin: 45px 0 65px;
    font-weight: 900;
    letter-spacing: 2%;

    span {
      color: #ffd70a;
    }
  }
`;

const Background = styled.div`
  background-image: url(${HeaderBackground.src});
  min-height: 450px;
  background-size: 100%;
  background-repeat: no-repeat;
`;

export function SectionOne() {
  const [login, loginResult] = useLoginUserLazyQuery();
  const [logout, logoutResult] = useLogoutLazyQuery();

  console.log("loginResult.data", loginResult.data);
  console.log("logoutResult.data", logoutResult.data);

  return (
    <Section>
      <h1>
        Welcome Package <span>150%</span>
      </h1>
      <button
        onClick={() =>
          login({
            variables: {
              input: {
                username: "arturs.valenieks+test4@networx.pro",
                password: "Test123$%",
              },
            },
          })
        }
      >
        Sign in
      </button>
      <button onClick={() => logout()}>Sign out</button>
      <Background>
        <Wrapper>
          <PayAndPlay />
        </Wrapper>
      </Background>
    </Section>
  );
}
