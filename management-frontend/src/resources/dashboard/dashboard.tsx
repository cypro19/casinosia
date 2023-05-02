import React from "react";
import { styled } from "@mui/system";

import Header from "./components/header";
import WidgetSection1 from "./components/widget-section1";
import WidgetSection2 from "./components/widget-section2";
import WidgetSection3 from "./components/widget-section3";

const PageContainer = styled("main")`
  width: 87rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => {
    return props.theme.spacing(2);
  }};
  padding-bottom: ${(props) => {
    return props.theme.spacing(2);
  }};
`;

export const Dashboard = () => {
  return (
    <PageContainer>
      <Header />
      <WidgetSection1 />
      <WidgetSection2 />
      <WidgetSection3 />
    </PageContainer>
  );
};
