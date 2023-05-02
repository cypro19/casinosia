import { takeLatest, put } from 'redux-saga/effects'
import {
  getAdminUserDetails,
  createSAdminUser,
  superAdminViewToggleStatus,
  updateSAdminUser,
  getAllGroups,
  getAllWithdrawRequestSAdmin
} from '../../utils/apiCalls'
import { toast } from '../../components/Toast'

import {
  updateSAdminUserStart,
  updateSAdminUserComplete,
  getAdminUserDetailsStart,
  getAdminUserDetailsSuccess,
  getAdminUserDetailsFailure,
  createSAdminUserStart,
  createSAdminUserComplete,
  updateSAdminStatusStart,
  updateSAdminStatusComplete,
  getAllGroupsStart,
  getAllGroupsSuccess,
  getAllGroupsFailure,
  getAllWithdrawRequestStart,
  getAllWithdrawRequestSuccess,
  getAllWithdrawRequestFailure
} from '../redux-slices/adminUser'
import { AdminRoutes } from '../../routes'
import { getAllAdminsStart } from '../redux-slices/admins'

export default function * adminUserWatcher () {
  yield takeLatest(getAdminUserDetailsStart.type, getAdminUserDetailsWorker)
  yield takeLatest(createSAdminUserStart.type, createSAdminUserWorker)
  yield takeLatest(updateSAdminUserStart.type, updateSAdminUserWorker)
  yield takeLatest(
    updateSAdminStatusStart.type,
    updateSAdminStatusWorker
  )
  yield takeLatest(getAllGroupsStart.type, getAllGroupsWorker)
  yield takeLatest(getAllWithdrawRequestStart.type, getAllWithdrawRequestWorker)
}

function * getAllWithdrawRequestWorker (action) {
  try {
    const { name, status, page, limit, startDate, endDate, paymentProvider } = action && action.payload
    const { data } = yield getAllWithdrawRequestSAdmin({ name, status, page, limit, startDate, endDate, paymentProvider })
      yield put(getAllWithdrawRequestSuccess(data?.data?.withdrawRequest))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllWithdrawRequestFailure())
  }
}

function * getAdminUserDetailsWorker (action) {
  try {
    const { adminUserId} = action && action.payload
    const { data } = yield getAdminUserDetails({ adminUserId })

    yield put(getAdminUserDetailsSuccess(data?.data?.adminDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAdminUserDetailsFailure(e.response.data.message))
  }
}

function * createSAdminUserWorker (action) {
  try {
    const { data, navigate } = action && action.payload

    yield createSAdminUser(data)

    yield put(createSAdminUserComplete())

    yield toast(`${data?.role} Created Successfully`, 'success')

    navigate(AdminRoutes.Admins)
  } catch (e) {
    yield put(createSAdminUserComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * updateSAdminUserWorker (action) {
  try {
    const { data, navigate, profile } = action && action.payload

    yield updateSAdminUser(data)

    profile
      ? (setTimeout(() => {
          navigate(AdminRoutes.Profile)
        }
        , 7000))
      : navigate(AdminRoutes.Admins)

    yield put(updateSAdminUserComplete())

    yield toast(`${data?.role} Updated Successfully`, 'success')
  } catch (e) {
    yield put(updateSAdminUserComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * updateSAdminStatusWorker (action) {
  try {
    const {
      data,
      limit,
      pageNo,
      orderBy,
      sort,
      search,
      superAdminId,
      superRoleId
    } = action && action.payload

    yield superAdminViewToggleStatus(data)

    yield put(updateSAdminStatusComplete())

    yield put(
      getAllAdminsStart({
        limit,
        pageNo,
        orderBy,
        sort,
        search,
        superAdminId,
        superRoleId
      })
    )

    yield toast('Status Updated Successfully', 'success')
  } catch (e) {
    yield put(updateSAdminStatusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * getAllGroupsWorker (action) {
  try {
    const { data } = yield getAllGroups()

    yield put(getAllGroupsSuccess(data?.data?.groupNames))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllGroupsFailure(e.response.data.message))
  }
}
