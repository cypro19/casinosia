import { takeLatest, put } from 'redux-saga/effects'
import {
  createCms,
  toggleStatus
} from '../../utils/apiCalls'
import {
  createCmsStart,
  createCmsSuccess,
  createCmsFailure,
  updateCmsStatusStart,
  updateCmsStatusComplete,
} from '../redux-slices/cmsFetchData'
import { toast } from '../../components/Toast'
import { AdminRoutes } from '../../routes'

export default function * cmsFetchDataWatcher () {
  yield takeLatest(createCmsStart.type, createCmsWorker)
  yield takeLatest(updateCmsStatusStart.type, updateCmsStatusWorker)
}

function * createCmsWorker (action) {
  try {
    const { cmsData, navigate } = action && action.payload

    yield createCms({ data: cmsData?.cmsData })

    yield toast('CMS created', 'success')

    navigate(AdminRoutes.CMS)

    yield put(createCmsSuccess())
  } catch (e) {
    yield put(createCmsFailure())

    yield toast(e?.response?.data?.message, 'error')
  }
}

function * updateCmsStatusWorker (action) {
  try {
    const { cmsPageId, status, limit, search, pageNo, isActive } =
      action && action.payload

    yield toggleStatus({ cmsPageId, status, code: 'CMS' })

    yield toast('CMS status updated', 'success')

    yield put(updateCmsStatusComplete())
  } catch (e) {
    yield put(updateCmsStatusComplete())

    yield toast(e?.response?.data?.message, 'error')
  }
}