import styled from "styled-components";
import { Panel } from "./Panel";
import Link from "next/link";
import Image from "next/image";

import EmailIcon from "@assets/my-profile/EmailIcon.svg";

const StyledPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const StyledLink = styled(Link)`
  height: 40px;
  width: fit-content;
  padding: 0 37px;
  border-radius: 20px;
  border: 1px solid
    ${(props) => props.theme.page.profile.panel.button.outlined.border};
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.page.profile.panel.button.outlined.text};
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: 0.3s all ease-in;
`;

const Header = styled.header`
  display: flex;
  column-gap: 10px;
  align-items: center;

  h2 {
    font-size: 18px;
    color: ${(props) => props.theme.page.profile.panel.text};
    font-weight: 700;
    transition: 0.3s all ease-in;
  }
`;

const Icon = styled.div``;

const Content = styled.p`
  color: ${(props) => props.theme.page.profile.panel.heading};
  font-size: 14px;
  line-height: 28px;
  transition: 0.3s all ease-in;
`;

export const ChangeEmail = () => {
  return (
    <StyledPanel>
      <Header>
        <Icon>
          <Image src={EmailIcon} height="28" width="28" alt="Icon" />
        </Icon>
        <h2>Email</h2>
      </Header>
      <Content>
        Fill and confirm email to complete the registration process and get the
        access to bonus program.
      </Content>
      <StyledLink href="/my-profile/change-email">Change Email</StyledLink>
    </StyledPanel>
  );
};
