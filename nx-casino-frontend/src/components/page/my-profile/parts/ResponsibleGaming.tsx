import styled from "styled-components";
import { Panel } from "./Panel";
import Link from "next/link";

import ResponsibleGamingIcon from "@assets/my-profile/ResponsibleGaming.png";
import Image from "next/image";

const StyledPanel = styled(Panel)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 60px;
`;

const Left = styled.div`
  display: flex;
  column-gap: 30px;
`;

const Right = styled.div`
  display: flex;
  column-gap: 10px;
`;

const Icon = styled.div``;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  justify-content: center;

  h2 {
    font-size: 18px;
    color: ${(props) => props.theme.page.profile.panel.text};
    font-weight: 600;
    transition: 0.3s all ease-in;
  }

  p {
    font-size: 14px;
    line-height: 28px;
    color: ${(props) => props.theme.page.profile.panel.heading};
    font-weight: 400;
    transition: 0.3s all ease-in;
  }
`;

const StyledLink = styled(Link)`
  height: 40px;
  padding: 0 37px;
  border-radius: 20px;
  background-color: #ffd808;
  display: flex;
  align-items: center;
  color: #121925;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
`;

export const ResponsibleGaming = () => {
  return (
    <StyledPanel>
      <Left>
        <Icon>
          <Image
            src={ResponsibleGamingIcon}
            width="60"
            height="82"
            alt="Verify your Identity"
          />
        </Icon>
        <Box>
          <h2>Responsible Gaming</h2>
          <p>
            Let’s make responsibility great again! Set up some game limits to
            keep your SlotoTop experience awesome as much as possible.
          </p>
        </Box>
      </Left>
      <Right>
        <StyledLink href="/my-profile/settings">Settings</StyledLink>
      </Right>
    </StyledPanel>
  );
};
