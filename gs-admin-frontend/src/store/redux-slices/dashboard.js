import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getPlayerManagementStart,
    getPlayerManagementComplete,
    getPlayerManagementFailure,
    getLivePlayersReportStart,
    getLivePlayersReportComplete,
    getLivePlayersReportFailure,
    getPlayerLiabilityStart,
    getPlayerLiabilitySuccess,
    getPlayerLiabilityFailure,
    getKPISummaryStart,
    getKPISummarySuccess,
    getKPISummaryFailure,
    getKPIReportStart,
    getKPIReportSuccess,
    getKPIReportFailure,
    getGameReportFailure,
    getGameReportSuccess,
    getGameReportStart,
    getPlayerGameReportFailure,
    getPlayerGameReportSuccess,
    getPlayerGameReportStart,
    getElasticHealthStart,
    getElasticHealthComplete,
    getElasticHealthFailure,
    clearGameReport
  },
  reducer
} = createSlice({
  name: 'dashboard',
  initialState: {
    loading: false,
    playerLoading: false,
    demogData: [],
    topPlayers: null,
    playerLogedInData: null,
    playerLiabilityData: null,
    KPISummary: null,
    KPIReport: null,
    elasticHealth: false,
    gameReport: null
  },
  reducers: {
    getPlayerManagementStart: (state) => ({
      ...state,
      playerLoading: true
    }),
    getPlayerManagementComplete: (state, { payload }) => ({
      ...state,
      playerLoading: false,
      playerData: payload
    }),
    getPlayerManagementFailure: (state) => ({
      ...state,
      playerLoading: false
    }),
    getLivePlayersReportStart: (state) => ({
      ...state,
      livePlayerloading: true
    }),
    getLivePlayersReportComplete: (state, { payload }) => ({
      ...state,
      livePlayerloading: false,
      livePlayerData: payload
    }),
    getLivePlayersReportFailure: (state) => ({
      ...state,
      livePlayerloading: false
    }),
    getPlayerLiabilityStart: (state) => ({
      ...state,
      playerLiablityLoading: true
    }),
    getPlayerLiabilitySuccess: (state, { payload }) => ({
      ...state,
      playerLiablityLoading: false,
      playerLiabilityData: payload
    }),
    getPlayerLiabilityFailure: (state) => ({
      ...state,
      playerLiablityLoading: false
    }),
    getKPISummaryStart: (state) => ({
      ...state,
      kpiSummeryLoading: true
    }),
    getKPISummarySuccess: (state, { payload }) => ({
      ...state,
      kpiSummeryLoading: false,
      KPISummary: payload
    }),
    getKPISummaryFailure: (state) => ({
      ...state,
      kpiSummeryLoading: false
    }),
    getKPIReportStart: (state) => ({
      ...state,
      kpiReportLoading: true
    }),
    getKPIReportSuccess: (state, { payload }) => ({
      ...state,
      kpiReportLoading: false,
      KPIReport: payload
    }),
    getKPIReportFailure: (state) => ({
      ...state,
      kpiReportLoading: false
    }),
    getGameReportStart: (state) => ({
      ...state,
      gameReportLoading: true
    }),
    getGameReportSuccess: (state, { payload }) => ({
      ...state,
      gameReportLoading: false,
      gameReport: payload
    }),
    getGameReportFailure: (state) => ({
      ...state,
      gameReportLoading: false
    }),
    getPlayerGameReportStart: (state) => ({
      ...state,
      gameReportLoadingPlayer: true
    }),
    getPlayerGameReportSuccess: (state, { payload }) => ({
      ...state,
      gameReportLoadingPlayer: false,
      gameReportPlayer: payload
    }),
    getPlayerGameReportFailure: (state) => ({
      ...state,
      gameReportLoadingPlayer: false
    }),
    clearGameReport: (state) => ({
      ...state,
      gameReportPlayer: null
    }),
    getElasticHealthStart: (state) => ({
      ...state
    }),
    getElasticHealthComplete: (state, { payload }) => ({
      ...state,
      elasticHealth: payload
    }),
    getElasticHealthFailure: (state) => ({
      ...state
    })
  }
})

export default reducer

export {
  getPlayerManagementStart,
  getPlayerManagementComplete,
  getPlayerManagementFailure,
  getLivePlayersReportStart,
  getLivePlayersReportComplete,
  getLivePlayersReportFailure,
  getPlayerLiabilityStart,
  getPlayerLiabilitySuccess,
  getPlayerLiabilityFailure,
  getKPISummaryStart,
  getKPISummarySuccess,
  getKPISummaryFailure,
  getKPIReportStart,
  getKPIReportSuccess,
  getKPIReportFailure,
  getGameReportFailure,
  getGameReportSuccess,
  getGameReportStart,
  getPlayerGameReportFailure,
  getPlayerGameReportSuccess,
  getPlayerGameReportStart,
  getElasticHealthStart,
  getElasticHealthComplete,
  getElasticHealthFailure,
  clearGameReport
}
