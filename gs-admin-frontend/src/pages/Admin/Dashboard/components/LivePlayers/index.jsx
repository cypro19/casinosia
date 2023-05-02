import React from "react";
import { Row, Col } from "@themesberg/react-bootstrap";
import useLivePlayers from "../../hooks/useLivePlayers";
import { SpinnerLoader } from "../../../../../components/Preloader";
import "./livePlayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faMobileAlt,
  faTabletAlt,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { CircleChart } from "../../../../../components/CircleChart";
import { getTextColor } from "../../../../../utils/dashboardEffects";
import { Box, Card, Typography } from "@mui/material";
import { StyledCard } from "./StyledCard";

export default () => {
  const { loading, livePlayerData, fetchDetails } = useLivePlayers();

  const icons = {
    desktop: faDesktop,
    mobile: faMobileAlt,
    tablet: faTabletAlt,
  };
  const color = { desktop: "secondary", mobile: "primary", tablet: "tertiary" };

  return (
    livePlayerData && (
      <StyledCard>
        <Box className="player_report_box">
          <Typography className="player_report">Live Player Report</Typography>
        </Box>
        <Box>
          <Box className="row">
            <Box className="box">
              <Box className="label_box">
                <Typography className="label">TODAY GGR</Typography>
              </Box>
              <Box className="content_box">
                <Typography className="content">
                  € {livePlayerData.todayTotalGgr || 0}
                </Typography>
              </Box>
            </Box>
            <Box className="box">
              <Box className="label_box">
                <Typography className="label">TOTAL PLAYERS</Typography>
              </Box>
              <Box className="content_box">
                <Typography className="content">
                  {livePlayerData.totalPlayers}
                </Typography>
              </Box>
            </Box>
            <Box className="box">
              <Box className="label_box">
                <Typography className="label">
                  REGISTRATION CONV.RATE
                </Typography>
              </Box>
              <Box className="content_box">
                <Typography className="content">
                  {livePlayerData.registrationConvRate || 0} %
                </Typography>
              </Box>
            </Box>
            <Box className="box">
              <Box className="label_box">
                <Typography className="label">DEPOSIT CONV.RATE</Typography>
              </Box>
              <Box className="content_box">
                <Typography className="content">
                  {livePlayerData.depositConvRate || 0} %
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </StyledCard>
    )
  );
};
