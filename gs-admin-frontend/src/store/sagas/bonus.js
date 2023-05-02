import { takeLatest, put } from 'redux-saga/effects'
import { serialize } from 'object-to-formdata'

import {
  createBonus,
  updateBonus,
  getSAConvertAmount,
  getBonus,
  superAdminViewToggleStatus,
  getPaymentMethod,
  issueBonus,
  getUserBonus,
  cancelBonus,
} from '../../utils/apiCalls'
import {
  getSAConvertAmountStart,
  getSAConvertAmountSuccess,
  getSAConvertAmountFailure,
  createBonusStart,
  createBonusComplete,
  updateBonusStart,
  updateBonusComplete,
  getBonusStart,
  getBonusSuccess,
  getBonusFailure,
  issueBonusStart,
  issueBonusComplete,
  getUserBonusStart,
  getUserBonusSuccess,
  getUserBonusFailure,
  cancelBonusStart,
  cancelBonusComplete,
  updateSABonusStatusStart,
  updateSABonusStatusComplete,
  getSAPaymentMethodStart,
  getSAPaymentMethodSuccess,
  getSAPaymentMethodFailure
} from '../redux-slices/bonus'
import { toast } from '../../components/Toast'
import { getAllBonusStart } from '../redux-slices/admins'
import { AdminRoutes } from '../../routes'
// import { objectToFormData } from '../../utils/objectToFormdata'

export default function * bonusWatcher () {
  yield takeLatest(getSAConvertAmountStart.type, getSAConvertAmountWorker)
  yield takeLatest(createBonusStart.type, createBonusStartWorker)
  yield takeLatest(updateBonusStart.type, updateBonusStartWorker)
  yield takeLatest(getBonusStart.type, getBonusStartWorker)
  yield takeLatest(issueBonusStart.type, issueBonusWorker)
  yield takeLatest(getUserBonusStart.type, getUserBonusWorker)
  yield takeLatest(cancelBonusStart.type, cancelBonusWorker)
  yield takeLatest(updateSABonusStatusStart.type, updateSABonusStatusWorker)
  yield takeLatest(getSAPaymentMethodStart.type, getSAPaymentMethodWorker)
}

function * getBonusStartWorker (action) {
  try {
    const { bonusId, userBonusId='' } = action && action.payload
    const { data } = yield getBonus({ bonusId, userBonusId: userBonusId || '' })
    yield put(getBonusSuccess(data?.data?.bonusDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(getBonusFailure())
  }
}
function * createBonusStartWorker (action) {
  try {
    let { data, navigate } = action && action.payload
    data = serialize(data)
    yield createBonus(data)
    yield toast('Bonus Created successfully', 'success')
    navigate('/admin/bonus')
    yield put(createBonusComplete())
  } catch (e) {
    if (e.response.status === 400 && e.response.data.message === 'already exists') {
      yield toast('Joining Bonus already exists', 'error')
    } else yield toast(e.response.data.message, 'error')
    yield put(createBonusComplete())
  }
}

function * updateBonusStartWorker (action) {
  try {
    let { data, navigate } = action && action.payload
    data = serialize(
      data
    )
    yield updateBonus(data)
    yield toast('Bonus Updated successfully', 'success')
    navigate('/admin/bonus')
    yield put(updateBonusComplete())
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(updateBonusComplete())
  }
}
function * issueBonusWorker (action) {
  try {
    const { data } = action && action.payload

    yield issueBonus({ data })

    yield put(issueBonusComplete())

    yield put(getUserBonusStart({ limit: 10, pageNo: 1, bonusType: 'all', status: 'all', userId: data?.userId }))

    yield toast('Bonus issued successfully', 'success')
  } catch (e) {
    yield put(issueBonusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * getUserBonusWorker (action) {
  try {
    const { limit, pageNo, bonusType, status, userId } = action && action.payload

    const { data } = yield getUserBonus({ limit, pageNo, bonusType, status, userId })

    yield put(getUserBonusSuccess(data?.data?.userBonus))
  } catch (e) {
    yield put(getUserBonusFailure())
  }
}

function * cancelBonusWorker (action) {
  try {
    const { data, limit, pageNo, bonusType, status, userId } = action && action.payload

    yield cancelBonus({ data })

    yield put(getUserBonusStart({ limit, pageNo, bonusType, status, userId }))

    yield put(cancelBonusComplete())

    yield toast('Bonus cancelled successfully', 'success')
  } catch (e) {
    yield put(cancelBonusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * getSAConvertAmountWorker (action) {
  try {
    const { currencyCode, maxBonusThreshold, minDeposit, maxWinAmount, zeroOutThreshold } = action && action.payload
    const { res } = yield getSAConvertAmount({ currencyFields: { maxBonusThreshold, minDeposit, maxWinAmount, zeroOutThreshold }, currencyCode })

    yield put(getSAConvertAmountSuccess(res?.data?.wallet))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getSAConvertAmountFailure(e.response.data.message))
  }
}

function * updateSABonusStatusWorker (action) {
  try {
    const { limit, pageNo, bonusType, isActive, search, data } = action && action.payload

    yield superAdminViewToggleStatus(data)
    yield put(updateSABonusStatusComplete())
    yield toast('Bonus Status Updated Successfully', 'success')

    yield put(getAllBonusStart({ limit, pageNo, bonusType, isActive, search }))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(updateSABonusStatusComplete())
  }
}

function * getSAPaymentMethodWorker () {
  try {
    const { data } = yield getPaymentMethod({ flag: 'admin' })
    yield put(getSAPaymentMethodSuccess(data?.data?.paymentMethods))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(getSAPaymentMethodFailure())
  }
}
