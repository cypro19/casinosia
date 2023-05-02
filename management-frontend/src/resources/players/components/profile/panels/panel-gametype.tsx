import React, { useState } from "react";
import { ReactNode } from "react";
import { useTranslate } from "@pankod/refine-core";
import { styled } from "@mui/system";

import { Box, Button, Typography } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

import Panel from "./panel";
import { smallPanelHeader } from "../../../styles";

const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => {
    return props.theme.spacing(3.75);
  }};
`;

const Header = () => {
  const translate = useTranslate();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  const handleButtonClick = (index: number) => {
    setSelectedButtonIndex(index);
  };

  return (
    <HeaderContainer>
      <Typography variant="h6" sx={smallPanelHeader}>
        {translate("page.playerProfile.typography.gameType")}
      </Typography>
    </HeaderContainer>
  );
};

const ChartContainer = styled("div")`
  min-width: 100%;
  height: 17.8125rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
`;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scaleShowLabels: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    yAxis: {
      min: 0,
      max: 50,
      ticks: {
        display: false,
      },
    },
  },
};

export const getData = (translate: ReturnType<typeof useTranslate>) => ({
  labels: ["slots", "table", "livecasino"],
  datasets: [
    {
      label: "Current Year",
      data: [150, 250, 100],
      backgroundColor: ["#312E81", "#4338CA", "#6366F1"],
      tension: 0.5,
    },
  ],
});

export const PanelGameType = () => {
  const translate = useTranslate();
  return (
    <Panel header={<Header />}>
      <ChartContainer>
        <Doughnut options={options} data={getData(translate)} />
      </ChartContainer>
      <Box
        sx={{ display: "flex", gap: "1.2rem", justifyContent: "space-evenly" }}
      >
        <Typography variant="subtitle1" fontSize=".875rem">
          <span style={{ color: "#312E81" }}>&#x2022;</span>
          {translate("page.playerProfile.typography.slots")}
        </Typography>
        <Typography variant="subtitle1" fontSize=".875rem">
          <span style={{ color: "#4338CA" }}>&#x2022;</span>
          {translate("page.playerProfile.typography.table")}
        </Typography>
        <Typography variant="subtitle1" fontSize=".875rem">
          <span style={{ color: "#6366F1" }}>&#x2022;</span>
          {translate("page.playerProfile.typography.liveCasino")}
        </Typography>
      </Box>
    </Panel>
  );
};

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 20.25rem;
  height: 28.625rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
  flex: 1;
  order: 0;
  flex-grow: 1;
`;
interface PlayerInfoPanelProps {
  children?: ReactNode;
}

export const GameTypePanel: React.FC<PlayerInfoPanelProps> = ({ children }) => {
  return <Card>{children}</Card>;
};
