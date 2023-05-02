import React from "react";

import { Refine } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  Layout,
  LightTheme,
  ReadyPage,
  ThemeProvider,
  ErrorComponent,
  AuthPage,
  Title,
} from "@pankod/refine-mui";
import { createTheme } from "@mui/material";

import dataProvider, { GraphQLClient } from "@pankod/refine-graphql";
import routerProvider from "@pankod/refine-react-router-v6";
import { authProvider } from "./auth-provider/auth-provider";
import { useTranslation } from "react-i18next";

import { ListPlayers } from "./resources/players/list-players";
import { ListGames } from "./resources/games/list-games";
import { Dashboard } from "./resources/dashboard/dashboard";

import { Header } from "@reusable/header";
import { Sidebar } from "@reusable/sidebar";
import { PlayerProfile } from "./resources/players/components/profile/player-profile";

const API_URL = "http://localhost:8000/v1/graphql";

const client = new GraphQLClient(API_URL);
const gqlDataProvider = dataProvider(client);

const theme = createTheme({
  ...LightTheme,
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    fontSize: 16,
  },
  spacing: (factor: number) => `${1 * factor}rem`,
});

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          dataProvider={gqlDataProvider}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          Title={Title}
          Sider={Sidebar}
          Layout={Layout}
          Header={Header}
          LoginPage={AuthPage}
          authProvider={authProvider}
          routerProvider={routerProvider}
          i18nProvider={i18nProvider}
          resources={[
            {
              name: t("page.dashboard.name"),
              list: Dashboard,
            },
            {
              name: t("page.playerProfile.name"),
              list: PlayerProfile,
            },
            {
              name: "PlayerManagement",
            },
            {
              name: t("page.players.name"),
              parentName: "PlayerManagement",
              list: ListPlayers,
            },
            {
              name: t("page.playerGroups.name"),
              parentName: "PlayerManagement",
              list: ListPlayers,
            },
            {
              name: t("page.playerTags.name"),
              parentName: "PlayerManagement",
              list: ListPlayers,
            },
            {
              name: t("page.playerBets.name"),
              parentName: "PlayerManagement",
              list: ListPlayers,
            },
            {
              name: t("page.playerSuspicions.name"),
              parentName: "PlayerManagement",
              list: ListPlayers,
            },
            {
              name: "GamesManagement",
            },
            {
              name: t("page.games.name"),
              parentName: "GamesManagement",
              list: ListGames,
            },
            {
              name: t("page.gameCategories.name"),
              parentName: "GamesManagement",
              list: ListGames,
            },
            {
              name: t("page.gameCollections.name"),
              parentName: "GamesManagement",
              list: ListGames,
            },
            {
              name: t("page.gameFeatures.name"),
              parentName: "GamesManagement",
              list: ListGames,
            },
            {
              name: t("page.gameIntegrations.name"),
              parentName: "GamesManagement",
              list: ListGames,
            },
          ]}
        />
      </RefineSnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
