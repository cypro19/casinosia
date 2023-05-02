import { useTranslate } from "@pankod/refine-core";
import { Avatar, Box, Chip, Typography } from "@pankod/refine-mui";
import React from "react";
import { usePlayerAccountDataGrid } from "../../hooks/usePlayerAccountDataGrid";
import { usePlayerCompPointsDataGrid } from "../../hooks/usePlayerCompPointsDataGrid";
import { usePlayerIssuedBonusesDataGrid } from "../../hooks/usePlayerIssuedBonusesDataGrid";
import { usePlayerIssuedFreeSpinsDataGrid } from "../../hooks/usePlayerIssuedFreeSpinsDataGrid";
import { usePlayerLastPaymentsDataGrid } from "../../hooks/usePlayerLastPaymentsDataGrid";
import { usePlayerLastEventsDataGrid } from "../../hooks/usePlayerLastEventsDataGrid";
import { DataGridComponent } from "./datagrids/use-datagrid";
import { GameTypePanel, PanelGameType } from "./panels/panel-gametype";
import { PlayerPlayTime } from "./panels/panel-playtime";
import { PanelStatistics } from "./panels/panel-statistics";
import { PlayerTopGames } from "./panels/panel-topgames";
import { PlayerInfo } from "./panels/player-info";
import { PlayerPanelSmall } from "./panels/player-small";
import { PageContainer, Container, StyledButton } from "./profile-components";
import { List, ListItem } from "@mui/material";

export const PlayerProfile = () => {
  const translate = useTranslate();
  const { fields: accountFields, columns: accountColumns } =
    usePlayerAccountDataGrid();
  const { fields: pointsFields, columns: pointsColumns } =
    usePlayerCompPointsDataGrid();
  const { fields: bonusFields, columns: bonusColumns } =
    usePlayerIssuedBonusesDataGrid();
  const { fields: freeSpinFields, columns: freeSpinColumns } =
    usePlayerIssuedFreeSpinsDataGrid();
  const { fields: lastPaymentFields, columns: lastPaymentColumns } =
    usePlayerLastPaymentsDataGrid();
  const { fields: lastEventFields, columns: lastEventColumns } =
    usePlayerLastEventsDataGrid();
  return (
    <PageContainer>
      <Container>
        <Box className="flex flex-start personal-details-container">
          <Avatar className="avatar">OP</Avatar>
          <Box className="flex column personal-details-box">
            <Box className="flex content-box">
              <Typography className="full-name">Michael Franclin</Typography>
              <Chip
                className="chip country"
                avatar={
                  <Avatar
                    className="chip-avatar"
                    src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                  ></Avatar>
                }
              />
              <Chip className="chip verified" size="small" label="VERIFIED" />
              <Chip className="chip vip" size="small" label="VIP" />
              <Chip className="chip affiliate" size="small" label="AFFILIATE" />
            </Box>
            <Box className="flex content-email">
              <Typography className="email">
                michael.franclin@franclinassets.com
              </Typography>
              <Chip
                className="chip user-code"
                label="5e86805e2bafd54f66cc95c3"
                size="small"
              />
            </Box>
          </Box>
        </Box>
        <Box className="flex flex-start personal-details-container-vertical">
          <Box className="item column">
            <Typography className="details-head">$567989.89</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.balance")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">$567989.89</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.deposits")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">$589.89</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.cashouts")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">$567989.89</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.netRevenue")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">9768.89</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.points")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">45.67%</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.bonusRate")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">16.56%</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.cashouteRate")}
            </Typography>
          </Box>
          <Box className="item">
            <Typography className="details-head">3 min</Typography>
            <Typography className="details-sub">
              {translate("page.playerProfile.typography.lastOnline")}
            </Typography>
          </Box>
        </Box>
      </Container>
      <Box className="flex panels-container">
        <PlayerInfo>
          <Box className="flex column info">
            <Typography className="text-bold-black" variant="h6">
              Player Info
            </Typography>
            <Box className="flex column info-table">
              <List className="flex column styled-list">
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.fullName")}
                    </Typography>
                  </Box>
                  <Box className="flex flex-start">
                    <Typography className="text-normal" color="#111927">
                      Michael Franclin
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.phone")}
                    </Typography>
                  </Box>
                  <Box className="flex-col-box">
                    <Typography className="text-normal" color="#111927">
                      +345 456 456 4567
                    </Typography>
                    <Typography className="text-normal" color="#F79009">
                      {translate("page.playerProfile.typography.notVerified")}
                    </Typography>
                    <List className="flex list-row">
                      <Typography className="text-normal" color="#111927">
                        {translate("page.playerProfile.typography.verify")}
                      </Typography>
                      <Typography className="text-normal" color="#111927">
                        {translate("page.playerProfile.typography.sendSMS")}
                      </Typography>
                      <Typography className="text-normal" color="#111927">
                        {translate("page.playerProfile.typography.edit")}
                      </Typography>
                    </List>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.email")}
                    </Typography>
                  </Box>
                  <Box className="flex-col-box">
                    <Typography className="text-normal" color="#111927">
                      alex@mydomaintopvie...
                    </Typography>
                    <Typography className="text-normal" color="#F79009">
                      {translate("page.playerProfile.typography.notVerified")}
                    </Typography>
                    <List className="flex list-row">
                      <Typography className="text-normal" color="#111927">
                        {translate("page.playerProfile.typography.verify")}
                      </Typography>
                      <Typography className="text-normal" color="#111927">
                        {translate("page.playerProfile.typography.sendMail")}
                      </Typography>
                      <Typography className="text-normal" color="#111927">
                        {translate("page.playerProfile.typography.edit")}
                      </Typography>
                    </List>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.signedFrom")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      Bulgaria
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.lastSession")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      22.01.2023 18:56:45
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.lastIP")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      255.255.255.255
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.created")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      23.04.2023 17:45:23
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.terms")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      23.04.2023 17:45:23
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.affiliate")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      13567X3478
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography className="text-normal" color="#6C737F">
                      {translate("page.playerProfile.typography.manager")}
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography className="text-normal" color="#111927">
                      Alexander BiBiBi
                    </Typography>
                  </Box>
                </ListItem>
              </List>
            </Box>
          </Box>
        </PlayerInfo>
        <Box className="flex panels-main">
          <Box className="flex panels-row">
            <PlayerPanelSmall>
              <Box className="flex panels-small-box">
                <Typography className="text-bold-black" variant="h6">
                  {translate("page.playerProfile.typography.tags")}
                </Typography>
                <StyledButton variant="outlined" color="info">
                  {translate("page.playerProfile.buttons.addTag")}
                </StyledButton>
              </Box>
              <Box className="flex chips-box">
                <Chip className="chip verified" size="small" label="VERIFIED" />
                <Chip className="chip vip" size="small" label="VIP" />
                <Chip
                  className="chip affiliate"
                  size="small"
                  label="AFFILIATE"
                />
                <Chip className="chip-default" size="small" label="+10" />
              </Box>
            </PlayerPanelSmall>
            <PlayerPanelSmall>
              <Box className="flex panels-small-box">
                <Typography className="text-bold-black" variant="h6">
                  Groups
                </Typography>
                <StyledButton variant="outlined" color="info">
                  {translate("page.playerProfile.buttons.addGroup")}
                </StyledButton>
              </Box>
              <Box className="flex chips-box">
                <Chip className="chip verified" size="small" label="VERIFIED" />
                <Chip className="chip vip" size="small" label="VIP" />
                <Chip
                  className="chip affiliate"
                  size="small"
                  label="AFFILIATE"
                />
                <Chip className="chip-default" size="small" label="+10" />
              </Box>
            </PlayerPanelSmall>
            <PlayerPanelSmall>
              <Box className="flex panels-small-box">
                <Typography className="text-bold-black" variant="h6">
                  {translate("page.playerProfile.typography.status")}
                </Typography>
              </Box>
              <Box className="flex panels-small-box">
                <Typography className="text-active" variant="subtitle1">
                  &#x2022;
                  {translate("page.playerProfile.typography.active")}
                </Typography>
              </Box>
            </PlayerPanelSmall>
          </Box>
          <Box className="fullwidth">
            <PanelStatistics />
          </Box>
        </Box>
      </Box>
      <Box className="flex panels-container">
        <GameTypePanel>
          <PanelGameType />
        </GameTypePanel>
        <PlayerPlayTime />
        <PlayerTopGames>
          <Box className="info-horizontal">
            <Typography className="text-bold-black" variant="h6">
              {translate("page.playerProfile.typography.playerInfo")}
            </Typography>
            <Box className="info">
              <List className="flex column styled-list">
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem className="list-item">
                  <Box>
                    <Typography fontSize=".875rem" color="#6C737F">
                      Bonus check
                    </Typography>
                  </Box>
                  <Box className="flex-start">
                    <Typography fontSize=".875rem" color="#111927">
                      4 134 567.78
                    </Typography>
                  </Box>
                </ListItem>
              </List>
            </Box>
          </Box>
        </PlayerTopGames>
      </Box>
      <DataGridComponent
        label={translate("page.playerProfile.typography.accounts")}
        buttons={[
          {
            label: translate("page.playerProfile.buttons.changeBalances"),
            color: "info",
            onClick: () => console.log("hi"),
          },
        ]}
        fields={accountFields}
        columns={accountColumns}
      />
      <DataGridComponent
        label={translate("page.playerProfile.typography.compPointAccounts")}
        buttons={[
          {
            label: translate("page.playerProfile.buttons.changeBalances"),
            color: "info",
            onClick: () => console.log("hi"),
          },
          {
            label: translate("page.playerProfile.buttons.exchangePoints"),
            color: "info",
            onClick: () => console.log("hi"),
          },
        ]}
        fields={pointsFields}
        columns={pointsColumns}
      />
      <DataGridComponent
        label={translate("page.playerProfile.typography.issuedBonuses")}
        buttons={[
          {
            label: translate("page.playerProfile.buttons.issuesBonus"),
            color: "info",
            onClick: () => console.log("hi"),
          },
        ]}
        fields={bonusFields}
        columns={bonusColumns}
      />
      <DataGridComponent
        label={translate("page.playerProfile.typography.issuedFreeSpins")}
        buttons={[
          {
            label: translate("page.playerProfile.buttons.issueFreeSpins"),
            color: "info",
            onClick: () => console.log("hi"),
          },
        ]}
        fields={freeSpinFields}
        columns={freeSpinColumns}
      />
      <DataGridComponent
        label={translate("page.playerProfile.typography.lastPayments")}
        buttons={[]}
        fields={lastPaymentFields}
        columns={lastPaymentColumns}
      />
      <DataGridComponent
        label={translate("page.playerProfile.typography.lastEvents")}
        buttons={[]}
        fields={lastEventFields}
        columns={lastEventColumns}
      />
    </PageContainer>
  );
};
