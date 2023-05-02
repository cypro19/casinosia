import Image from "next/image";
import React from "react";
import styled from "styled-components";

const StyledSection = styled.div`
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  row-gap: 17.5px;
`;

const SectionHeader = styled.header`
  h1 {
    font-size: 21px;
    font-weight: 800;
    color: #fff;
    display: flex;
    column-gap: 8px;
    align-items: center;
  }
`;

const SectionContent = styled.div``;

type HeaderProps = {
  title: string;
  image: string;
};

const Header = ({ title, image }: HeaderProps) => {
  return (
    <SectionHeader>
      <h1>
        <Image src={image} width="28" height="28" alt={title} />
        <span>{title}</span>
      </h1>
    </SectionHeader>
  );
};

type ContentProps = {
  children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
  return <SectionContent>{children}</SectionContent>;
};

type SectionProps = {
  title: string;
  icon: string;
  children: React.ReactNode;
};

export const Section = ({ children, title, icon }: SectionProps) => {
  return (
    <StyledSection>
      <Header title={title} image={icon} />
      <Content>{children}</Content>
    </StyledSection>
  );
};
