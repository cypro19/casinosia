import { takeLatest, put } from 'redux-saga/effects'
import {
  getAllSAdminTransactionsStart,
  getAllSAdminTransactionsSuccess,
  getAllSAdminTransactionsFailure,
  getSAdminCasinoTransactionsStart,
  getSAdminCasinoTransactionsSuccess,
  getSAdminCasinoTransactionsFailure
} from '../redux-slices/superAdminTransactions'
import {
  getAllSAdminTransactions,
  getSAdminCasinoTransactions
} from '../../utils/apiCalls'
import { toast } from '../../components/Toast'

export default function * SAdminTransactionsWatcher () {
  yield takeLatest(getAllSAdminTransactionsStart.type, getAllSAdminTransactionsWorker)
  yield takeLatest(getSAdminCasinoTransactionsStart.type, getSAdminCasinoTransactionsWorker)
}

function * getAllSAdminTransactionsWorker (action) {
  try {
    const {
      limit, pageNo, search, startDate, endDate, currencyId, transactionType, adminId, paymentProvider, isUserDetail,
      userId, status
    } =
      action && action.payload

    const { data } = yield getAllSAdminTransactions({
      limit,
      pageNo,
      search,
      startDate,
      endDate,
      currencyId,
      transactionType,
      adminId,
      paymentProvider,
      isUserDetail,
      userId,
      status
    })

    yield put(getAllSAdminTransactionsSuccess(data?.data?.transactionDetail))
  } catch (e) {
    yield put(getAllSAdminTransactionsFailure())

    yield toast(e?.response?.data?.message, 'error', 'transactionToast')
  }
}

function * getSAdminCasinoTransactionsWorker (action) {
  try {
    const {
      status,
      email,
      limit,
      pageNo,
      startDate,
      endDate,
      currencyCode,
      transactionType,
      adminId,
      userId
    } =
      action && action.payload

    const { data } = yield getSAdminCasinoTransactions({
      limit,
      pageNo,
      startDate,
      endDate,
      currencyCode,
      status,
      email,
      transactionType,
      userId
    })

    yield put(getSAdminCasinoTransactionsSuccess(data?.data?.transactionDetail))
  } catch (e) {
    yield put(getSAdminCasinoTransactionsFailure())

    yield toast(e?.response?.data?.message, 'error', 'transactionToast')
  }
}
