import React from "react";
import { Row, Col } from "@themesberg/react-bootstrap";
import Preloader from "../../../components/Preloader";
import LivePlayers from "./components/LivePlayers";
import TopPlayes from "./components/TopPlayes";
import PlayerLiability from "./components/PlayerLiability";
import KPISummary from "./components/KPISummary";
import KPIReport from "./components/KPIReport";
import GameReport from "./components/GameReport";
import useDashboard from "./hooks/useDashboard";
import { Typography, Card } from "@mui/material";

export default () => {
  const {
    reportsToShow,
    permissionKeys,
    loading,
    adminPermissions,
    elasticHealth,
    nonElasticReports,
  } = useDashboard();

  return (
    <>
      {loading ? (
        <Preloader />
      ) : adminPermissions &&
        permissionKeys.some((x) => reportsToShow.indexOf(x) >= 0) &&
        (elasticHealth ||
          permissionKeys.some((x) => nonElasticReports.indexOf(x) >= 0)) ? (
        <>
          <Typography variant="h4">Dashboard</Typography>

          {permissionKeys.includes("LivePlayerReport") && <LivePlayers />}

          {permissionKeys.includes("PlayerStatisticsReport") && (
            <Card className="p-2 mb-2">
              <TopPlayes />
            </Card>
          )}

          {elasticHealth &&
            permissionKeys.includes("PlayerLiabilityReport") && (
              <Card className="p-2 mb-2">
                <PlayerLiability />
              </Card>
            )}

          {elasticHealth && permissionKeys.includes("KpiSummaryReport") && (
            <Card className="p-2 mb-2">
              <KPISummary />
            </Card>
          )}

          {elasticHealth && permissionKeys.includes("KpiReport") && (
            <Card className="p-2 mb-2">
              <KPIReport />
            </Card>
          )}

          {elasticHealth && permissionKeys.includes("GameReport") && (
            <Card className="p-2 mb-2">
              <GameReport />
            </Card>
          )}
        </>
      ) : (
        <>
          <Card className="p-2 mb-2">
            <Row>
              <Col>
                <h3>Dashboard </h3>
              </Col>
            </Row>
          </Card>

          <Card style={{ height: "79vh" }}>
            <img className="m-auto" src="/nodata2.png" alt="nodata" />
          </Card>
        </>
      )}
    </>
  );
};
