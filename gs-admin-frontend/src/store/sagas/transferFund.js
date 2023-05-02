import { takeLatest, put } from 'redux-saga/effects'
import {
  depositToOwnerStart,
  depositToOwnerComplete
} from '../redux-slices/transferFund'
import {
  getSAdminWalletStart
} from '../redux-slices/login'
import {
  depositToOwner
} from '../../utils/apiCalls'
import { toast } from '../../components/Toast'

export default function * transferFundWatcher () {
  yield takeLatest(depositToOwnerStart.type, depositToOwnerWorker)
}

function * depositToOwnerWorker (action) {
  try {
    const { data } = action && action.payload

    yield depositToOwner(data)

    yield put(getSAdminWalletStart())
    yield put(depositToOwnerComplete())

    yield toast('Deposit Successful', 'success', 'depositSuccess')
  } catch (e) {
    yield put(depositToOwnerComplete())

    yield toast(e?.response?.data?.message, 'error', 'depositError')
  }
}
