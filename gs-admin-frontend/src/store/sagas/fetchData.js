import { takeLatest, put } from 'redux-saga/effects'
import {
  getAllAffiliates,
  getAllUsers,
  getAllCms,
  getUser,
  getAffiliateById,
  getCmsByPageId,
  getCountries,
  getRestrictedItems,
  getUnRestrictedItems,
  addRestrictedItems,
  deleteRestrictedItems,
  getRestrictedCountries,
  getUnRestrictedCountries,
  addRestrictedCountries,
  deleteRestrictedCountries,
  updateSAdminCMS,
  getGlobalRegistration,
  updateGlobalRegistration,
  getUserDocument,
  verifyUserDocument,
  superAdminViewToggleStatus,
  getCMSDynamicKeys,
  deleteCMSLanguage
} from '../../utils/apiCalls'

import {
  getAllAffiliatesStart,
  getAllAffiliatesSuccess,
  getAllAffiliatesFailure,
  getAllCmsStart,
  getAllCmsSuccess,
  getAllCmsFailure,
  getAllUsersStart,
  getAllUsersSuccess,
  getAllUsersFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
  getAffiliateByIdStart,
  getAffiliateByIdSuccess,
  getAffiliateByIdFailure,
  getCmsByPageIdStart,
  getCmsByPageIdSuccess,
  getCmsByPageIdFailure,
  getCountriesStart,
  getCountriesSuccess,
  getCountriesFailure,
  getRestrictedItemsStart,
  getRestrictedItemsSuccess,
  getRestrictedItemsFailure,
  getUnRestrictedItemsStart,
  getUnRestrictedItemsSuccess,
  getUnRestrictedItemsFailure,
  addRestrictedItemsStart,
  addRestrictedItemsComplete,
  deleteRestrictedItemsStart,
  deleteRestrictedItemsComplete,
  resetRestrictedItemsStart,
  resetRestrictedItemsComplete,
  getRestrictedCountriesStart,
  getRestrictedCountriesSuccess,
  getRestrictedCountriesFailure,
  getUnRestrictedCountriesStart,
  getUnRestrictedCountriesSuccess,
  getUnRestrictedCountriesFailure,
  addRestrictedCountriesStart,
  addRestrictedCountriesComplete,
  deleteRestrictedCountriesStart,
  deleteRestrictedCountriesComplete,
  resetRestrictedCountriesStart,
  resetRestrictedCountriesComplete,
  updateSAdminCMSStart,
  updateSAdminCMSComplete,
  getGlobalRegistrationStart,
  updateGlobalRegistrationStart,
  getGlobalRegistrationCompleted,
  getGlobalRegistrationFailed,
  updateGlobalRegistrationFailed,
  updateGlobalRegistrationCompleted,
  verifyUserDocumentStart,
  verifyUserDocumentComplete,
  updateSACMSStatusStart,
  updateSACMSStatusComplete,
  getCMSDynamicKeysStart,
  getCMSDynamicKeysSuccess,
  getCMSDynamicKeysFailure,
  deleteCMSLanguageStart,
  deleteCMSLanguageComplete,
  getUserDocumentSuccess,
  getUserDocumentFailure,
  getUserDocumentStart
} from '../redux-slices/fetchData'
import { toast } from '../../components/Toast'
import { AdminRoutes } from '../../routes'

export default function * dataWatcher () {
  yield takeLatest(getAllAffiliatesStart.type, getAllAffiliatesWorker)
  yield takeLatest(getAllCmsStart.type, cmsWorker)
  yield takeLatest(getAllUsersStart.type, getAllUsersWorker)
  yield takeLatest(getUserStart.type, getUserWorker)
  yield takeLatest(getAffiliateByIdStart.type, getAffiliateByIdWorker)
  yield takeLatest(getCmsByPageIdStart.type, getCmsByPageIdWorker)
  yield takeLatest(getCountriesStart.type, getCountriesWorker)
  yield takeLatest(getRestrictedItemsStart.type, getRestrictedItemsWorker)
  yield takeLatest(getUnRestrictedItemsStart.type, getUnRestrictedItemsWorker)
  yield takeLatest(addRestrictedItemsStart.type, addRestrictedItemsWorker)
  yield takeLatest(deleteRestrictedItemsStart.type, deleteRestrictedItemsWorker)
  yield takeLatest(resetRestrictedItemsStart.type, resetRestrictedItemsWorker)
  yield takeLatest(getRestrictedCountriesStart.type, getRestrictedCountriesWorker)
  yield takeLatest(getUnRestrictedCountriesStart.type, getUnRestrictedCountriesWorker)
  yield takeLatest(addRestrictedCountriesStart.type, addRestrictedCountriesWorker)
  yield takeLatest(deleteRestrictedCountriesStart.type, deleteRestrictedCountriesWorker)
  yield takeLatest(resetRestrictedCountriesStart.type, resetRestrictedCountriesWorker)
  yield takeLatest(updateSAdminCMSStart.type, updateSAdminCMSWorker)
  yield takeLatest(getGlobalRegistrationStart.type, getGlobalRegistartionWorker)
  yield takeLatest(updateGlobalRegistrationStart.type, updateGlobalRegistartionWorker)
  yield takeLatest(verifyUserDocumentStart.type, verifyUserDocumentWorker)
  yield takeLatest(updateSACMSStatusStart.type, updateSACMSStatusWorker)
  yield takeLatest(getCMSDynamicKeysStart.type, getCMSDynamicKeysWorker)
  yield takeLatest(deleteCMSLanguageStart.type, deleteCMSLanguageWorker)
  yield takeLatest(getUserDocumentStart.type, getUserDocumentWorker)
}

function * getCountriesWorker (action) {
  try {
    const { limit, pageNo, name } = action && action.payload

    const { data } = yield getCountries({
      limit,
      pageNo,
      name
    })

    yield put(getCountriesSuccess(data?.data?.countries))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getCountriesFailure())
  }
}

function * getAllAffiliatesWorker (action) {
  try {
    const { limit, pageNo, search } = action && action.payload

    const { data } = yield getAllAffiliates({
      limit,
      pageNo,
      search
    })

    yield put(getAllAffiliatesSuccess(data?.data?.affiliates))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllAffiliatesFailure(e.response.data.message))
  }
}

function * getAffiliateByIdWorker (action) {
  try {
    const { affiliateId } = action && action?.payload

    const { data } = yield getAffiliateById({
      affiliateId
    })

    yield put(getAffiliateByIdSuccess(data?.data?.affiliate))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAffiliateByIdFailure(e.response.data.message))
  }
}

function * cmsWorker (action) {
  try {
    const { limit, pageNo, search, adminId, isActive } = action && action.payload

    const { data } = yield getAllCms({
      limit,
      pageNo,
      search,
      adminId,
      isActive
    })

    yield put(getAllCmsSuccess(data?.data?.cmsPages))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllCmsFailure(e.response.data.message))
  }
}

function * getCmsByPageIdWorker (action) {
  try {
    const { cmsPageId } = action && action?.payload

    const { data } = yield getCmsByPageId({
      cmsPageId
    })

    yield put(getCmsByPageIdSuccess(data?.data?.cmsDetails))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')

    yield put(getCmsByPageIdFailure(e?.response?.data?.message))
  }
}

function * getAllUsersWorker (action) {
  try {
    const { limit, pageNo, search, kycStatus } = action && action.payload

    const { data } = yield getAllUsers({
      limit,
      pageNo,
      search,
      kycStatus
    })

    yield put(getAllUsersSuccess(data?.data?.users))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllUsersFailure(e.response.data.message))
  }
}

function * getUserWorker (action) {
  try {
    const { userId } = action && action.payload

    const { data } = yield getUser({
      userId
    })

    yield put(getUserSuccess(data?.data?.getUser))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getUserFailure(e.response.data.message))
  }
}

function * getRestrictedItemsWorker (action) {
  try {
    const { limit, pageNo, type, countryId } = action && action.payload

    const { data } = yield getRestrictedItems({
      limit,
      pageNo,
      type,
      countryId
    })

    if (type === 'games') {
      yield put(getRestrictedItemsSuccess(data?.data?.restrictedItems?.games))
    } else {
      yield put(getRestrictedItemsSuccess(data?.data?.restrictedItems?.providers))
    }
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getRestrictedItemsFailure())
  }
}

function * getUnRestrictedItemsWorker (action) {
  try {
    const { limit, pageNo, type, countryId } = action && action.payload

    const { data } = yield getUnRestrictedItems({
      limit,
      pageNo,
      type,
      countryId
    })

    if (type === 'games') {
      yield put(getUnRestrictedItemsSuccess(data?.data?.restrictedItems?.games))
    } else {
      yield put(getUnRestrictedItemsSuccess(data?.data?.restrictedItems?.providers))
    }
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getUnRestrictedItemsFailure())
  }
}

function * addRestrictedItemsWorker (action) {
  try {
    const { games, type, countryId, navigate } = action && action.payload

    yield addRestrictedItems({
      itemIds: games,
      type,
      countryId
    })

    yield toast('Restricted Items Updated Successfully', 'success')

    yield put(addRestrictedItemsComplete())

    navigate(AdminRoutes.Countries)
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(addRestrictedItemsComplete())
  }
}

function * deleteRestrictedItemsWorker (action) {
  try {
    const { games, type, countryId, navigate } = action && action.payload

    yield deleteRestrictedItems({
      itemIds: games,
      type,
      countryId
    })

    yield toast('Restricted Items Deleted Successfully', 'success')

    yield put(deleteRestrictedItemsComplete())

    navigate(AdminRoutes.Countries)
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(deleteRestrictedItemsComplete())
  }
}

function * resetRestrictedItemsWorker () {
  yield put(resetRestrictedItemsComplete())
}

function * getRestrictedCountriesWorker (action) {
  try {
    const { limit, pageNo, type, itemId } = action && action.payload

    const { data } = yield getRestrictedCountries({
      limit,
      pageNo,
      type,
      itemId
    })

    yield put(getRestrictedCountriesSuccess(data?.data?.restrictedCountries))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getRestrictedCountriesFailure())
  }
}

function * getUnRestrictedCountriesWorker (action) {
  try {
    const { limit, pageNo, type, itemId } = action && action.payload

    const { data } = yield getUnRestrictedCountries({
      limit,
      pageNo,
      type,
      itemId
    })

    yield put(getUnRestrictedCountriesSuccess(data?.data?.unrestrictedCountries))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getUnRestrictedCountriesFailure())
  }
}

function * addRestrictedCountriesWorker (action) {
  try {
    const { countries, type, itemId, navigate, game } = action && action.payload

    yield addRestrictedCountries({
      itemId,
      type,
      countryIds: countries
    })

    yield toast('Restricted Countries Updated Successfully', 'success')

    yield put(addRestrictedCountriesComplete())

    game
      ? navigate(AdminRoutes.CasinoGames)
      : navigate(AdminRoutes.CasinoProviders)
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(addRestrictedCountriesComplete())
  }
}

function * deleteRestrictedCountriesWorker (action) {
  try {
    const { countries, type, itemId, navigate, game } = action && action.payload

    yield deleteRestrictedCountries({
      itemId,
      type,
      countryIds: countries
    })

    yield toast('Restricted Countries Deleted Successfully', 'success')

    yield put(deleteRestrictedCountriesComplete())

    game
      ? navigate(AdminRoutes.CasinoGames)
      : navigate(AdminRoutes.CasinoProviders)
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(deleteRestrictedCountriesComplete())
  }
}

function * resetRestrictedCountriesWorker () {
  yield put(resetRestrictedCountriesComplete())
}

function * updateSAdminCMSWorker (action) {
  try {
    const { cmsData, navigate } = action && action.payload
    console.log(cmsData)
    yield updateSAdminCMS(cmsData?.cmsData)

    yield toast('CMS edited', 'success')

    yield put(updateSAdminCMSComplete())
    yield put(getCmsByPageIdStart({ cmsPageId: cmsData?.cmsData?.cmsPageId }))
    navigate(AdminRoutes.CMS)
  } catch (e) {
    yield put(updateSAdminCMSComplete())

    yield toast(e?.response?.data?.message, 'error')
  }
}

function * getGlobalRegistartionWorker () {
  try {
    const { data } = yield getGlobalRegistration()

    yield put(getGlobalRegistrationCompleted(data?.data))
  } catch (e) {
    yield put(getGlobalRegistrationFailed())

    yield toast(e?.response?.data?.message, 'error')
  }
}

function * updateGlobalRegistartionWorker (action) {
  try {
    const { data } = action && action.payload

    yield updateGlobalRegistration(data)

    yield put(updateGlobalRegistrationCompleted())
    yield put(getGlobalRegistrationStart())
    yield toast('Registration Fields Updated', 'success')
  } catch (e) {
    yield put(updateGlobalRegistrationFailed())

    yield toast(e?.response?.data?.message, 'error')
  }
}

function * getUserDocumentWorker (action) {
  try {
    const { userId } = action && action.payload

    const { data } = yield getUserDocument(userId, 'admin')

    yield put(getUserDocumentSuccess(data?.data?.userDocument))
  } catch (e) {
    yield put(getUserDocumentFailure())

    yield toast(e?.response?.data?.message, 'error')
  }
}

function * verifyUserDocumentWorker (action) {
  try {
    const { data, userId } = action && action.payload

    yield verifyUserDocument(data)

    yield put(verifyUserDocumentComplete())

    yield put(getUserStart({ userId }))

    yield toast('Document Verification Processed Successfully', 'success')

    yield put(getUserDocumentStart({ userId }))
  } catch (e) {
    yield put(verifyUserDocumentComplete())

    yield toast(e?.response?.data?.message, 'error')
  }
}

function * updateSACMSStatusWorker (action) {
  try {
    const { data, limit, pageNo, adminId, search, isActive } = action && action.payload

    yield superAdminViewToggleStatus(data)

    yield toast('CMS Status Updated Successfully', 'success')

    yield put(updateSACMSStatusComplete())
    yield put(getAllCmsStart({
      limit,
      pageNo,
      adminId,
      search,
      isActive
    }))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(updateSACMSStatusComplete())
  }
}

function * getCMSDynamicKeysWorker (action) {
  try {

    const { data } = yield getCMSDynamicKeys()

    yield put(getCMSDynamicKeysSuccess(data?.data))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getCMSDynamicKeysFailure())
  }
}

function * deleteCMSLanguageWorker (action) {
  try {
    const { data } = action && action.payload

    yield deleteCMSLanguage({ data })

    yield put(deleteCMSLanguageComplete())
    yield toast('CMS Language Deleted Successfully', 'success')
    yield put(getCmsByPageIdStart({ cmsPageId: data?.cmsPageId }))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(deleteCMSLanguageComplete())
  }
}
