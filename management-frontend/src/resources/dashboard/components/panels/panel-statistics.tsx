import React, { useState } from "react";
import { useTranslate } from "@pankod/refine-core";
import { styled } from "@mui/system";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import Panel from "@reusable/panel";

const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => {
    return props.theme.spacing(3.75);
  }};
`;

const HeaderH1 = styled(Typography)`
  font-weight: 700;
  font-size: 1.125rem;
  margin: 0;
  color: #111927;
`;

const StyledButton = styled(Button)<{ isSelected: boolean }>`
  text-transform: capitalize;
  color: #6366f1;
  border-color: #b1b3f8;
  font-size: 0.875rem;
  padding: ${(props) => {
    return props.theme.spacing(0.375) + " " + props.theme.spacing(1);
  }};

  ${({ isSelected }) =>
    isSelected &&
    `
    background-color: #6366f1;
    color: #fff;

    &:hover {
      background-color: #6366f1;
      border-color: #b1b3f8;
      color: #fff;
    }
  `}
`;

const Header = () => {
  const translate = useTranslate();
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

  const handleButtonClick = (index: number) => {
    setSelectedButtonIndex(index);
  };

  return (
    <HeaderContainer>
      <HeaderH1>Statistics</HeaderH1>
      <ButtonGroup size="small">
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 0}
          onClick={() => handleButtonClick(0)}
        >
          {translate("page.dashboard.panels.statistics.deposits")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 1}
          onClick={() => handleButtonClick(1)}
        >
          {translate("page.dashboard.panels.statistics.ggr")}
        </StyledButton>
        <StyledButton
          variant="outlined"
          isSelected={selectedButtonIndex === 2}
          onClick={() => handleButtonClick(2)}
        >
          {translate("page.dashboard.panels.statistics.ftds")}
        </StyledButton>
      </ButtonGroup>
    </HeaderContainer>
  );
};

const ChartContainer = styled("div")`
  width: 100%;
  height: 17.8125rem;
`;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
  labels: [
    translate("calendar.months.1.short"),
    translate("calendar.months.2.short"),
    translate("calendar.months.3.short"),
    translate("calendar.months.4.short"),
    translate("calendar.months.5.short"),
    translate("calendar.months.6.short"),
    translate("calendar.months.7.short"),
    translate("calendar.months.8.short"),
    translate("calendar.months.9.short"),
    translate("calendar.months.10.short"),
    translate("calendar.months.11.short"),
    translate("calendar.months.12.short"),
  ],
  datasets: [
    {
      label: "Current Year",
      data: [25, 25, 28, 20, 29, 24, 26, 24, 26, 24, 24, 26, 21, 26],
      borderColor: "#4338CA",
      backgroundColor: "#4338CA",
      tension: 0.5,
    },
    {
      label: "Previous Year",
      data: [30, 35, 38, 30, 39, 34, 36, 34, 34, 33, 32, 30, 31, 33],
      borderColor: "#6366F1",
      backgroundColor: "#6366F1",
      tension: 0.5,
    },
  ],
});

const PanelStatistics = () => {
  const translate = useTranslate();
  return (
    <Panel header={<Header />}>
      <ChartContainer>
        <Line options={options} data={getData(translate)} />
      </ChartContainer>
    </Panel>
  );
};

export default PanelStatistics;
