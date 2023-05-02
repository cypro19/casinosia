import React, { useState } from "react";
import { useTranslate } from "@pankod/refine-core";
import { styled } from "@mui/system";

import { Box } from "@mui/material";

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

import { ReactNode } from "react";

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  min-width: 20.1875rem;
  height: 26.75rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0rem 0.0313rem rgba(0, 0, 0, 0.03),
    0rem 0.3125rem 1.375rem rgba(0, 0, 0, 0.04);
  border-radius: 1.25rem;
`;
interface PlayerInfoPanelProps {
  children?: ReactNode;
  className?: string;
}

export const PlayerStatsCard: React.FC<PlayerInfoPanelProps> = ({
  children,
  className,
}) => {
  return <Card className={className}>{children}</Card>;
};

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
      label: "Deposits",
      data: [25, 25, 28, 20, 29, 24, 26, 24, 26, 24, 24, 26, 21, 26],
      borderColor: "#06AED4",
      backgroundColor: "#06AED4",
      tension: 0.5,
    },
    {
      label: "Withdrawals",
      data: [30, 35, 38, 30, 39, 34, 36, 34, 34, 33, 32, 30, 31, 33],
      borderColor: "#F79009",
      backgroundColor: "#F79009",
      tension: 0.5,
    },
    {
      label: "Bets",
      data: [12, 14, 18, 20, 21, 24, 28, 30, 33, 31, 30, 34, 35],
      borderColor: "#312E81",
      backgroundColor: "#312E81",
      tension: 0.5,
    },
  ],
});

export const PanelStatistics = () => {
  const translate = useTranslate();
  return (
    <PlayerStatsCard>
      <Line className="fullwidth" options={options} data={getData(translate)} />
    </PlayerStatsCard>
  );
};
