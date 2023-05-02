import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "@components/themeConfig";

const Content = styled.div`
  padding: 90px 0;
`;

type PageInterface = {
  children: React.ReactNode;
};

export const Page = ({ children }: PageInterface) => {
  const [theme, setTheme] = useState("dark");

  function themeToggle(toggle: string) {
    setTheme(toggle);
  }

  return (
    <ThemeProvider theme={theme == "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Header themeToggle={themeToggle} themeStatus={theme} />
      <Content>{children}</Content>
      <Footer />
    </ThemeProvider>
  );
};
