import { takeLatest, put } from 'redux-saga/effects'
import {
  superAdminViewToggleStatus,
  getAllCredentials,
  addDepositToOther,
  getAllClients,
  getOwnerPermissions
} from '../../utils/apiCalls'

import {
  getAllCredentialsStart,
  getAllCredentialsSuccess,
  getAllCredentialsFailure,
  createCredentialsStart,
  createCredentialsSuccess,
  createCredentialsFailure,
  updateCredentialsStart,
  updateCredentialsSuccess,
  updateCredentialsFailure,
  addDepositToOtherStart,
  addDepositToOtherCompleted,
  getAllClientsStart,
  getAllClientsSuccess,
  getAllClientsFailure,
  getOwnerPermissionStart,
  getOwnerPermissionSuccess,
  getOwnerPermissionFailure
} from '../redux-slices/players'

import { toast } from '../../components/Toast'
import { AdminRoutes } from '../../routes'
import { objectToFormData } from '../../utils/objectToFormdata'
import { getUserStart } from '../redux-slices/fetchData'
import { serialize } from 'object-to-formdata'

export default function * adminsWatcher () {
  yield takeLatest(getAllCredentialsStart.type, getAllCredentialsWorker)
  yield takeLatest(addDepositToOtherStart.type, AddDepositWorker)
  yield takeLatest(getAllClientsStart.type, getClientsWorker)
  yield takeLatest(getOwnerPermissionStart.type, getOwnerPermissionWorker)
}

function * getAllCredentialsWorker () {
  try {
    const { data } = yield getAllCredentials()

    yield put(getAllCredentialsSuccess(data?.data?.credentialsKeys))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllCredentialsFailure(e.response.data.message))
  }
}

function * AddDepositWorker (action) {
  try {
    const { data } = action && action.payload
    yield addDepositToOther({ data })
    yield put(addDepositToOtherCompleted())

    yield put(getUserStart({ userId: data?.userId }))

    data?.addAmount > 0
      ? yield toast('Deposit Successful', 'success')
      : yield toast('Amount Removed from Wallet Successful', 'success')
  } catch (e) {
    yield put(addDepositToOtherCompleted())

    yield toast(e.response.data.message, 'error')
  }
}

function * getClientsWorker (action) {
  try {
    const { orderBy, limit, pageNo, sort, search } = action && action.payload

    const { data } = yield getAllClients({ orderBy, limit, pageNo, sort, search })

    yield put(getAllClientsSuccess(data?.data?.adminDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllClientsFailure())
  }
}

function * getOwnerPermissionWorker () {
  try {
    const { data } = yield getOwnerPermissions()

    yield put(getOwnerPermissionSuccess(data?.data?.permissions))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getOwnerPermissionFailure())
  }
}
