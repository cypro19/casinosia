import { takeLatest, put } from 'redux-saga/effects'
import {
  getSAdminPlayerManagement,
  getSAdminLivePlayerReport,
  getSAPlayerLiability,
  getSAKPIReport,
  getSAKPISummary,
  getSAGameReport,
  getSAPlayerGameReport,
  getElasticHealth
} from '../../utils/apiCalls'

import {
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
} from '../redux-slices/dashboard'
import { toast } from '../../components/Toast'

export default function * dataWatcher () {
  yield takeLatest(getPlayerManagementStart.type, getPlayerManagementWorker)
  yield takeLatest(getLivePlayersReportStart.type, getTopPlayerReportWorker)
  yield takeLatest(getPlayerLiabilityStart.type, getPlayerLiabilityWorker)
  yield takeLatest(getKPISummaryStart.type, getKPISummaryWorker)
  yield takeLatest(getKPIReportStart.type, getKPIReportWorker)
  yield takeLatest(getGameReportStart.type, getGameReportWorker)
  yield takeLatest(getPlayerGameReportStart.type, getPlayerGameReportWorker)
  yield takeLatest(getElasticHealthStart.type, getElasticHealthWorker)
}

function * getPlayerManagementWorker (action) {
  try {
    const { endDate, startDate, limit, dateOptions, clearData } = action && action.payload

    const { data } = yield getSAdminPlayerManagement({ endDate, startDate, limit, dateOptions })

    yield put(getPlayerManagementComplete(data?.data))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getPlayerManagementFailure(e.response.data.message))
  }
}

function * getTopPlayerReportWorker (action) {
  try {

    const { data } = yield getSAdminLivePlayerReport()

    yield put(getLivePlayersReportComplete(data?.data))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getLivePlayersReportFailure(e.response.data.message))
  }
}

function * getPlayerLiabilityWorker (action) {
  try {
    const { endDate, startDate, dateOptions } = action && action.payload

    const { data } = yield getSAPlayerLiability({ endDate, startDate, dateOptions })

    yield put(getPlayerLiabilitySuccess(data?.data?.playerLiability))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getPlayerLiabilityFailure(e.response.data.message))
  }
}

function * getKPISummaryWorker (action) {
  try {
    const { endDate, startDate } = action && action.payload

    const { data } = yield getSAKPISummary({ endDate, startDate })

    yield put(getKPISummarySuccess(data?.data?.KPISummary))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getKPISummaryFailure(e.response.data.message))
  }
}

function * getKPIReportWorker (action) {
  try {
    const { endDate, startDate, dateOptions, selectedTab } = action && action.payload

    const { data } = yield getSAKPIReport({ endDate, startDate, dateOptions, selectedTab })
    yield put(getKPIReportSuccess(data?.data?.KPIReport))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getKPIReportFailure(e.response.data.message))
  }
}

function * getGameReportWorker (action) {
  try {
    const { endDate, startDate, dateOptions, selectedTab } = action && action.payload
    const { data } = yield getSAGameReport({ endDate, startDate, dateOptions, selectedTab })
    yield put(getGameReportSuccess(data?.data?.gameReport))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getGameReportFailure(e.response.data.message))
  }
}

function * getPlayerGameReportWorker (action) {
  try {
    const { endDate, startDate, dateOptions, selectedTab, limit, userId, clearData } = action && action.payload
   
    if(clearData) yield clearGameReport()
    const { data } = yield getSAPlayerGameReport({ endDate, startDate, dateOptions, selectedTab, limit, userId })

    yield put(getPlayerGameReportSuccess(data?.data?.gameReport))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getPlayerGameReportFailure(e.response.data.message))
  }
}

function * getElasticHealthWorker (action) {
  try {

    const { data } = yield getElasticHealth()

    if (data?.data?.success) {
      yield put(getElasticHealthComplete(data?.data?.success))
    } else {
      yield toast(data?.message, 'error')

      yield put(getElasticHealthFailure())
    }
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getElasticHealthFailure(e.response.data.message))
  }
}
