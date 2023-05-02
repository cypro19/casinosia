import { takeLatest, put, select } from 'redux-saga/effects'
import {
  getAdmin,
  getAdminChildren,
  getAllAdmins,
  getAllBonus,
  getSAdminDetails,
  superAdminViewToggleStatus,
} from '../../utils/apiCalls'

import {
  getAllAdminsStart,
  getAllAdminsSuccess,
  getAllAdminsFailure,
  updateAdminStatusStart,
  updateAdminStatusSuccess,
  updateAdminStatusFailure,
  getAdminDetailsStart,
  getAdminDetailsSuccess,
  getAdminDetailsFailure,
  getSAdminDetailsStart,
  getSAdminDetailsSuccess,
  getSAdminDetailsFailure,
  getAllBonusStart,
  getAllBonusComplete,
  getAllBonusFailure,
  getAdminChildrenStart,
  getAdminChildrenSuccess,
  getAdminChildrenFailure,
  getAdminDataStart,
  getAdminDataSuccess,
  getAdminDataFailure
} from '../redux-slices/admins'

import { toast } from '../../components/Toast'
import { getAllClientsStart } from '../redux-slices/players'
import { cloneDeep } from 'lodash'

export default function * adminssWatcher () {
  yield takeLatest(getAllAdminsStart.type, getAllAdminsWorker)
  yield takeLatest(updateAdminStatusStart.type, updateAdminStatusWorker)
  yield takeLatest(getAdminDetailsStart.type, getAdminDetailsWorker)
  yield takeLatest(getSAdminDetailsStart.type, getSAdminDetailsWorker)
  yield takeLatest(getAllBonusStart.type, getBonusListingWorker)
  yield takeLatest(getAdminChildrenStart.type, getAdminChildrenWorker)
  yield takeLatest(getAdminDataStart.type, getAdminDataWorker)
}
const getAdminState = (state) => state.admins

function * getAllAdminsWorker (action) {
  try {
    const { limit, pageNo, orderBy, search, sort, superAdminId, superRoleId } =
      action && action.payload

    const { data } = yield getAllAdmins({
      limit,
      pageNo,
      orderBy,
      search,
      sort,
      superAdminId,
      superRoleId
    })

    yield put(getAllAdminsSuccess(data?.data?.adminDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllAdminsFailure(e.response.data.message))
  }
}

function * updateAdminStatusWorker (action) {
  try {
    const {
      adminId,
      status,
      limit,
      pageNo,
      orderBy,
      search,
      sort,
      superAdminId
    } = action && action.payload

    yield superAdminViewToggleStatus({ adminId, status, code: 'SUPERADMIN' })

    yield put(updateAdminStatusSuccess())

    yield put(
      getAllAdminsStart({ limit, pageNo, orderBy, search, sort, superAdminId })
    )

    yield toast('Admin Status Updated Successfully', 'success')
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(updateAdminStatusFailure(e.response.data.message))
  }
}

function * getAdminDetailsWorker (action) {
  try {
    const { adminId } = action && action.payload

    const { data } = yield getAdmin({ adminId })

    yield put(getAdminDetailsSuccess(data?.data?.adminDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAdminDetailsFailure(e.response.data.message))
  }
}

function * getSAdminDetailsWorker (action) {
  try {
    const { data } = yield getSAdminDetails()

    yield put(getSAdminDetailsSuccess(data?.data?.adminDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getSAdminDetailsFailure(e.response.data.message))
  }
}

function * getAdminDataWorker (action) {
  try {
    const { adminId } = action && action.payload

    const { data } = yield getAdmin({ adminId })

    yield put(getAdminDataSuccess(data?.data?.adminDetails))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAdminDataFailure(e.response.data.message))
  }
}

function * getBonusListingWorker (action) {
  try {
    const { limit = '', pageNo = '', bonusType = '', isActive = '', search = '', userId = '' } = action && action.payload

    const { data } = yield getAllBonus({ limit, pageNo, bonusType, isActive, search, userId })

    yield put(getAllBonusComplete(data?.data?.bonus))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllBonusFailure(e.response.data.message))
  }
}

function * getAdminChildrenWorker (action) {
  try {
    const { superAdminId, parentAdmin, superRoleId } =
      action && action.payload
    const { adminChildren } = yield select(getAdminState)

    const addChildrenToAdmin = (newAdminChildren, id, children) => {
      if (newAdminChildren?.id === id) {
        return newAdminChildren.children = [...children]
      }

      if (newAdminChildren?.children?.length) {
        for (const admin of newAdminChildren.children) {
          addChildrenToAdmin(admin, id, children)
        }
      }
    }

    const { data } = yield getAdminChildren({ superAdminId, superRoleId })

    const newAdminChildren = cloneDeep(adminChildren)
    const children = data?.data?.adminDetails?.map((item) => {
      return {
        id: item.superAdminUserId,
        name: `${item.firstName || ''} (${item.childCount})`,
        children: [],
        data: item
      }
    })
    yield addChildrenToAdmin(newAdminChildren, superAdminId, children)

    yield put(getAdminChildrenSuccess(newAdminChildren))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')

    yield put(getAdminChildrenFailure())
  }
}
