import { takeLatest, put } from 'redux-saga/effects'
import {
  getAllWithdrawRequestStart,
  getAllWithdrawRequestSuccess,
  getAllWithdrawRequestFailure,
  updateLimitsStart,
  updateLimitsComplete,
  disableUserStart,
  disableUserComplete
} from '../redux-slices/adminTUsers'
import {
  getAllWithdrawRequestSAdmin,
  setDailyLimit,
  setDepositLimit,
  setLossLimit,
  disableUser,
  setSessionLimit
} from '../../utils/apiCalls'
import { toast } from '../../components/Toast'
import { getUserDocumentStart } from '../redux-slices/cmsFetchData'
import { getUserStart } from '../redux-slices/fetchData'

export default function * AdminTUsersWatcher () {
  yield takeLatest(getAllWithdrawRequestStart.type, getAllWithdrawRequestWorker)
  yield takeLatest(updateLimitsStart.type, updateLimitsWorker)
  yield takeLatest(disableUserStart.type, disableUserWorker)
}

function * getAllWithdrawRequestWorker (action) {
  try {
    const { type, name, status, page, limit, startDate, endDate, paymentProvider } = action && action.payload
    const { data } = yield getAllWithdrawRequestSAdmin({ name, status, page, limit, startDate, endDate, paymentProvider })
      yield put(getAllWithdrawRequestSuccess(data?.data?.withdrawRequest))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllWithdrawRequestFailure())
  }
}

function * updateLimitsWorker (action) {
  try {
    const { data } = action && action.payload

    data?.type === 'wager'
      ? yield setDailyLimit({ data })
      : (
          data?.type === 'deposit'
            ? yield setDepositLimit({ data })
            : yield setLossLimit({ data })
        )
    yield put(updateLimitsComplete())

    data?.reset
      ? yield toast('Limits Reset Successfully', 'success')
      : yield toast('Limits Updated Successfully', 'success')

    yield put(getUserStart({ userId: data.userId }))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(updateLimitsComplete(e.response.data.message))
  }
}

function * disableUserWorker (action) {
  try {
    const { data } = action && action.payload

    data?.type
      ? yield disableUser({ data })
      : yield setSessionLimit({ data })

    yield put(disableUserComplete())

    yield toast(`Account ${data?.reset ? 'Enabled' : 'Disabled'} Successfully`, 'success')

    yield put(getUserStart({ userId: data.userId }))
  } catch (e) {
    yield put(disableUserComplete())

    yield toast(e?.response?.data?.message, 'error')
  }
}
