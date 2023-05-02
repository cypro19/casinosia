import { takeLatest, put } from 'redux-saga/effects'
import {
  cancelDocumentRequest,
  getDocumentLabel,
  updateDocumentLabel,
  createDocumentLabel,
  requestDocument,
  getloyaltyLevel,
  updateloyaltyLevel,
  getAllSABanners,
  uploadSABanner,
  updateSABanner
} from '../../utils/apiCalls'
import {
  getDocumentLabelStart,
  getDocumentLabelSuccess,
  getDocumentLabelFailure,
  updateDocumentLabelStart,
  updateDocumentLabelComplete,
  createDocumentLabelStart,
  createDocumentLabelComplete,
  updateDocumentStart,
  updateDocumentComplete,
  getloyaltyLevelStart,
  getloyaltyLevelSuccess,
  getloyaltyLevelFailure,
  updateloyaltyLevelStart,
  updateloyaltyLevelComplete,
  getAllSABannersStart,
  getAllSABannersSuccess,
  getAllSABannersFailure,
  uploadSABannerStart,
  uploadSABannerComplete,
  updateSABannerStart,
  updateSABannerComplete
} from '../redux-slices/superAdminSettings'
import { toast } from '../../components/Toast'
import { serialize } from 'object-to-formdata'
import { getUserDocumentStart } from '../redux-slices/fetchData'

export default function * superAdminSettingsWatcher () {
  yield takeLatest(getDocumentLabelStart.type, getDocumentLabelWorker)
  yield takeLatest(updateDocumentLabelStart.type, updateDocumentLabelWorker)
  yield takeLatest(createDocumentLabelStart.type, createDocumentLabelWorker)
  yield takeLatest(updateDocumentStart.type, updateDocumentWorker)
  yield takeLatest(getloyaltyLevelStart.type, getloyaltyLevelWorker)
  yield takeLatest(updateloyaltyLevelStart.type, updateloyaltyLevelWorker)
  yield takeLatest(getAllSABannersStart.type, getAllSABannersWorker)
  yield takeLatest(updateSABannerStart.type, updateSABannerWorker)
  yield takeLatest(uploadSABannerStart.type, uploadSABannerWorker)
}

function * getDocumentLabelWorker (action) {
  try {
    const { userId } = action && action.payload

    const { data } = yield getDocumentLabel(userId)

    yield put(getDocumentLabelSuccess(data?.data?.documentLabel))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'docToast')

    yield put(getDocumentLabelFailure(e.response.data.message))
  }
}

function * updateDocumentLabelWorker (action) {
  try {
    const { data } = action && action.payload

    yield updateDocumentLabel(data)

    yield put(updateDocumentLabelComplete())
    yield toast('Labels Updated Successfully', 'success', 'docToast')
    yield put(getDocumentLabelStart({ userId: '' }))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'docToast')

    yield put(updateDocumentLabelComplete())
  }
}

function * createDocumentLabelWorker (action) {
  try {
    const { data } = action && action.payload

    yield createDocumentLabel(data)

    yield put(createDocumentLabelComplete())
    yield toast('Label Created Successfully', 'success', 'docToast')
    yield put(getDocumentLabelStart({ userId: '' }))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'docToast')

    yield put(createDocumentLabelComplete())
  }
}

function * updateDocumentWorker (action) {
  try {
    const { data, isRequested } = action && action.payload

    isRequested ? yield requestDocument(data) : yield cancelDocumentRequest(data)

    yield updateDocumentComplete()
    yield put(getUserDocumentStart({ userId: data?.userId }))
    yield put(getDocumentLabelStart({ userId: data?.userId }))

    yield toast(`Document ${isRequested ? 'Requested' : 'UnRequested'} Successfully`, 'success', 'docToast')
  } catch (e) {
    yield updateDocumentComplete()

    yield toast(e.response.data.message, 'error', 'docToast')
  }
}

function * getloyaltyLevelWorker (action) {
  try {
    const { data } = yield getloyaltyLevel()

    yield put(getloyaltyLevelSuccess(data?.data?.loyaltyLevel))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'loyaltyToast')

    yield put(getloyaltyLevelFailure(e.response.data.message))
  }
}

function * updateloyaltyLevelWorker (action) {
  try {
    const { loyaltyLevel } = action && action.payload
    yield updateloyaltyLevel({ loyaltyLevel })

    yield put(updateloyaltyLevelComplete())

    yield toast('Data Updated Successfully', 'success', 'loyaltyToast')
    yield put(getloyaltyLevelStart())
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'loyaltyToast')

    yield put(updateloyaltyLevelComplete())
  }
}

function * getAllSABannersWorker (action) {
  try {
    const { limit, pageNo } = action && action.payload

    const { data } = yield getAllSABanners({ limit, pageNo })

    yield put(getAllSABannersSuccess(data?.data?.banners))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'bannerToast')

    yield put(getAllSABannersFailure(e.response.data.message))
  }
}

function * updateSABannerWorker (action) {
  try {
    const { data: banner, limit, pageNo } = action && action.payload
    const data = serialize(banner)

    if (banner?.image) {
      yield updateSABanner(data)
    }

    yield put(updateSABannerComplete())

    yield toast('Banner Updated Successfully', 'success', 'bannerToast')
    yield put(getAllSABannersStart({
      limit,
      pageNo,
    }))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'bannerToast')

    yield put(updateSABannerComplete())
  }
}

function * uploadSABannerWorker (action) {
  try {
    const { data: banner, limit, pageNo } = action && action.payload
    const data = serialize(banner)

    yield uploadSABanner(data)

    yield put(uploadSABannerComplete())

    yield toast('Banner Uploaded Successfully', 'success', 'bannerToast')
    yield put(getAllSABannersStart({
      limit,
      pageNo,
    }))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'bannerToast')

    yield put(uploadSABannerComplete())
  }
}
