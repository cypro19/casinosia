import { takeLatest, put } from 'redux-saga/effects'
import {
  getAllCasinoProviders,
  getAllCasinoGames,
  createCasinoProvider,
  createCasinoGame,
  updateCasinoGame,
  updateCasinoProvider,
  superAdminViewToggleStatus,
  getSAdminAggregators,
  createSAdminAggregator,
  getSAdminGameCategory,
  getSAdminGameSubCategory,
  getAllSAProviders,
  getFreeSpinGames,
  getReorderGames,
  updateReorderGames,
  toggleStatus,
  createCasinoCategory,
  updateCasinoCategory,
  deleteCategory,
  updateCategoryReOrder,
  updateSubCategoryReOrder,
  getCasinoSubCategories,
  createCasinoSubCategory,
  deleteSubCategory,
  updateSubCategory,
  updateGame,
  deleteGame,
  getGames,
  addGamesToSubCategory,
  getMasterGames
} from '../../utils/apiCalls'
import {
  getAllCasinoProvidersStart,
  getAllCasinoProvidersSuccess,
  getAllCasinoProvidersFailure,
  createCasinoProviderStart,
  createCasinoProviderComplete,
  createCasinoCategoryStart,
  createCasinoCategoryComplete,
  updateCasinoCategoryStart,
  updateCasinoCategoryComplete,
  deleteCategoryStart,
  deleteCategoryComplete,
  updateCategoryReOrderStart,
  updateCategoryReOrderComplete,
  updateCasinoProviderStart,
  updateCasinoProviderComplete,
  getAllCasinoGamesStart,
  getAllCasinoGamesSuccess,
  getAllCasinoGamesFailure,
  createCasinoGameStart,
  createCasinoGameComplete,
  updateCasinoGameStart,
  updateCasinoGameComplete,
  resetCasinoGameStart,
  resetCasinoGameSuccess,
  updateCasinoStatusStart,
  updateCasinoStatusComplete,
  getSAdminAggregatorsStart,
  getSAdminAggregatorsSuccess,
  getSAdminAggregatorsFailure,
  createSAdminAggregatorStart,
  createSAdminAggregatorComplete,
  updateSAdminAggregatorStatusStart,
  updateSAdminAggregatorStatusComplete,
  getSAdminGameCategoryStart,
  getSAdminGameCategorySuccess,
  getSAdminGameCategoryFailure,
  getSAdminGameSubCategoryStart,
  getSAdminGameSubCategorySuccess,
  getSAdminGameSubCategoryFailure,
  updateSACasinoGamesStatusStart,
  updateSACasinoGamesStatusComplete,
  getAllSAProvidersStart,
  getAllSAProvidersSuccess,
  getAllSAProvidersFailure,
  getFreeSpinGamesStart,
  getFreeSpinGamesSuccess,
  getFreeSpinGamesFailure,
  updateReorderGamesStart,
  updateReorderGamesSuccess,
  updateReorderGamesFailure,
  updateCategoryStatusStart,
  updateCategoryStatusComplete,
  getAllSubCategoriesStart,
  getAllSubCategoriesSuccess,
  getAllSubCategoriesFailure,
  createSubCategoryStart,
  createSubCategoryComplete,
  updateSubCategoryStart,
  updateSubCategoryComplete,
  deleteSubCategoryStart,
  deleteSubCategoryComplete,
  updateSubCategoryStatusStart,
  updateSubCategoryStatusComplete,
  updateGameComplete,
  getAllGamesStart,
  updateGameStatusStart,
  updateGameStart,
  updateGameStatusComplete,
  deleteGameStart,
  deleteGameComplete,
  getAllGamesSuccess,
  getAllGamesFailure,
  addGamesToSubCategoryStart,
  addGamesToSubCategoryComplete,
  getAllMasterGamesStart,
  getAllMasterGamesSuccess,
  getAllMasterGamesFailure,
} from '../redux-slices/superAdminCasinoManagement'
import { toast } from '../../components/Toast'

import { objectToFormData } from '../../utils/objectToFormdata'
import { AdminRoutes } from '../../routes'

export default function * superAdminCasinoManagementWatcher () {
  yield takeLatest(getAllCasinoProvidersStart.type, getAllCasinoProvidersWorker)
  yield takeLatest(getAllCasinoGamesStart.type, getAllCasinoGamesWorker)
  yield takeLatest(createCasinoGameStart.type, createCasinoGameWorker)
  yield takeLatest(createCasinoProviderStart.type, createCasinoProviderWorker)
  yield takeLatest(updateCasinoGameStart.type, updateCasinoGameWorker)
  yield takeLatest(updateCasinoProviderStart.type, updateCasinoProviderWorker)
  yield takeLatest(resetCasinoGameStart.type, resetCasinoGameWorker)
  yield takeLatest(updateCasinoStatusStart.type, updateCasinoStatusWorker)
  yield takeLatest(getSAdminAggregatorsStart.type, getSAdminAggregatorsWorker)
  yield takeLatest(createSAdminAggregatorStart.type, createSAdminAggregatorWorker)
  yield takeLatest(updateSAdminAggregatorStatusStart.type, updateSAdminAggregatorStatusWorker)
  yield takeLatest(getSAdminGameCategoryStart.type, getSAdminGameCategoryWorker)
  yield takeLatest(getSAdminGameSubCategoryStart.type, getSAdminGameSubCategoryWorker)
  yield takeLatest(updateSACasinoGamesStatusStart.type, updateSACasinoGamesStatusWorker)
  yield takeLatest(getAllSAProvidersStart.type, getAllSAProvidersWorker)
  yield takeLatest(getFreeSpinGamesStart.type, getFreeSpinGamesWorker)
  yield takeLatest(updateReorderGamesStart.type, updateReorderGamesWorker)  
  yield takeLatest(updateCategoryStatusStart.type, updateCategoryStatusWorker)
  yield takeLatest(createCasinoCategoryStart.type,createCasinoCategoryWorker)
  yield takeLatest(updateCasinoCategoryStart.type,updateCasinoCategoryWorker)
  yield takeLatest(deleteCategoryStart.type,deleteCategoryWorker)
  yield takeLatest(updateCategoryReOrderStart.type,updateSubCategoryOrder)
  yield takeLatest(getAllSubCategoriesStart.type,getAllSubCategoriesWorker)
  yield takeLatest(createSubCategoryStart.type,createSubCategoryWorker)
  yield takeLatest(updateSubCategoryStart.type,updateSubCategoryWorker)
  yield takeLatest(deleteSubCategoryStart.type,deleteSubCategoryWorker)
  yield takeLatest(updateSubCategoryStatusStart.type,updateSubCategoryStatusWorker)
  yield takeLatest(getAllGamesStart.type,getAllGamesWorker)
  yield takeLatest(deleteGameStart.type,deleteGameWorker)
  yield takeLatest(updateGameStatusStart.type,updateGameStatusWorker)
  yield takeLatest(updateGameStart.type,updateGameWorker)
  yield takeLatest(addGamesToSubCategoryStart.type,addGamesToSubCategoryWorker)
  yield takeLatest(getAllMasterGamesStart.type,getAllMasterGamesWorker)
}

function * getAllMasterGamesWorker (action) {
  try {
    const { bonusId, limit, pageNo, search, casinoCategoryId, providerId, freespins } = action && action.payload

    const { data } = yield getMasterGames({
      limit,
      pageNo,
      search,
      casinoCategoryId,
      providerId,
      freespins: freespins || '',
      bonusId: bonusId || ''
    })

    yield put(getAllMasterGamesSuccess(data?.data?.casinoGames))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllMasterGamesFailure())
  }
}

function * addGamesToSubCategoryWorker (action) {
  try {
    const { masterGameSubCategoryId, games, navigate } = action && action.payload

    yield addGamesToSubCategory({
      masterGameSubCategoryId: parseInt(masterGameSubCategoryId),
      games
    })

    yield toast('Games Added To Sub Category', 'success')

    navigate(AdminRoutes.CasinoSubCategory)

    yield put((addGamesToSubCategoryComplete()))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put((addGamesToSubCategoryComplete()))
  }
}

function * getAllGamesWorker (action) {
  try {
    const { limit, pageNo, casinoCategoryId, isActive, orderBy, sort, providerId } = action && action.payload

    const { data } = yield getGames({
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      orderBy,
      sort,
      providerId
    })

    yield put(getAllGamesSuccess(data?.data?.categoryGames))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllGamesFailure())
  }
}

function * deleteGameWorker (action) {
  try {
    const {
      data,
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      providerId
    } = action && action.payload

    yield deleteGame(data)

    yield put(getAllGamesStart({
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      orderBy: 'categoryGameId',
      sort: 'desc',
      providerId
    }))

    yield put(deleteGameComplete())

    yield toast('Game Deleted Successfully', 'success')
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(deleteGameComplete())
  }
}

function * updateGameStatusWorker (action) {
  try {
    const {
      data,
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      providerId
    } =
      action && action.payload

    yield toggleStatus(data)

    yield put(getAllGamesStart({
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      orderBy: 'categoryGameId',
      sort: 'desc',
      providerId
    }))

    yield put(updateGameStatusComplete())

    yield toast('Casino Game Status Updated Successfully', 'success')
  } catch (e) {
    yield put(updateGameStatusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * updateGameWorker (action) {
  try {
    const {
      data,
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      providerId
    } =
      action && action.payload

    yield updateGame(objectToFormData(data))

    yield put(getAllGamesStart({
      limit,
      pageNo,
      casinoCategoryId,
      isActive,
      orderBy: 'categoryGameId',
      sort: 'desc',
      providerId
    }))

    yield put(updateGameComplete())

    yield toast('Casino Game Updated Successfully', 'success')
  } catch (e) {
    yield put(updateGameComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * updateSubCategoryStatusWorker (action) {
  try {
    const { categoryId, status, code, limit, pageNo, search, categoryFilter, isActive } =
      action && action.payload

    yield toggleStatus({ masterGameSubCategoryId: categoryId, status, code })

    yield put(updateSubCategoryStatusComplete())

    yield put(getAllSubCategoriesStart({ limit, pageNo, search, categoryId: categoryFilter, isActive, orderBy: 'masterGameSubCategoryId', sort: 'desc' }))

    yield toast('Casino Sub Category Status Updated Successfully', 'success')
  } catch (e) {
    yield put(updateSubCategoryStatusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * updateSubCategoryWorker (action) {
  try {
    const { data, limit, pageNo, search, categoryFilter, isActive } = action && action.payload

    yield updateSubCategory(data)

    yield put(updateSubCategoryComplete())

    yield put(getAllSubCategoriesStart({ limit, pageNo, search, categoryId: categoryFilter, isActive, orderBy: 'masterGameSubCategoryId', sort: 'desc' }))

    yield toast('Casino Sub Category Updated Successfully', 'success')
  } catch (e) {
    yield put(updateSubCategoryComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * deleteSubCategoryWorker (action) {
  try {
    const { data, limit, pageNo, search, categoryFilter, isActive } = action && action.payload

    yield deleteSubCategory(data)

    yield put(getAllSubCategoriesStart({ limit, pageNo, search, categoryId: categoryFilter, isActive, orderBy: 'masterGameSubCategoryId', sort: 'desc' }))

    yield put(deleteSubCategoryComplete())

    yield toast('Casino Sub Category Deleted Successfully', 'success')
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(deleteSubCategoryComplete())
  }
}

function * createSubCategoryWorker (action) {
  try {
    const { data, limit, pageNo, search, isActive, categoryFilter } = action && action.payload

    yield createCasinoSubCategory(data)

    yield put(createSubCategoryComplete())

    yield put(getAllSubCategoriesStart({ limit, pageNo, search, categoryId: categoryFilter, isActive, orderBy: 'masterGameSubCategoryId', sort: 'desc' }))

    yield toast('Casino Sub Category Created Successfully', 'success')
  } catch (e) {
    yield put(createSubCategoryComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * getAllSubCategoriesWorker (action) {
  try {
    const { limit, pageNo, categoryId, search, isActive, orderBy, sort } = action && action.payload

    const { data } = yield getCasinoSubCategories({
      limit,
      pageNo,
      categoryId,
      search,
      isActive,
      orderBy,
      sort
    })

    yield put(getAllSubCategoriesSuccess(data?.data?.casinoSubCategories))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllSubCategoriesFailure())
  }
}

function * updateSubCategoryOrder (action) {
  try {
    const { data, navigate, isSubCategory } = action && action.payload
    isSubCategory ? yield updateSubCategoryReOrder(data) : updateCategoryReOrder(data)
    yield put(updateCategoryReOrderComplete())
    yield toast(`Casino${isSubCategory ? ' Sub' : ''} Category Updated Successfully`, 'success')
    navigate(isSubCategory ? '/admin/casino-sub-category' : '/admin/casino-category')
  } catch (e) {
    yield toast(e.response.data.message, 'error')
  }
}

function * deleteCategoryWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload

    yield deleteCategory(data)

    yield put(getSAdminGameCategoryStart({
      limit,
      pageNo
    }))

    yield put(deleteCategoryComplete())

    yield toast('Casino Category Deleted Successfully', 'success')
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(deleteCategoryComplete())
  }
}

function * updateCasinoCategoryWorker (action) {
  try {
    const {
      data,
      limit,
      pageNo
    } = action && action.payload

    yield updateCasinoCategory(data)

    yield put(updateCasinoCategoryComplete())

    yield put(getSAdminGameCategoryStart({ limit, pageNo }))

    yield toast('Casino Category Updated Successfully', 'success')
  } catch (e) {
    yield put(updateCasinoCategoryComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * createCasinoCategoryWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload

    yield createCasinoCategory(data)

    yield put(createCasinoCategoryComplete())

    yield put(getSAdminGameCategoryStart({ limit, pageNo }))

    yield toast('Casino Category Created Successfully', 'success')
  } catch (e) {
    yield put(createCasinoCategoryComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * updateCategoryStatusWorker (action) {
  try {
    const { categoryId, status, code, limit, pageNo } =
      action && action.payload

    yield toggleStatus({ masterGameCategoryId: categoryId, status, code })

    yield put(updateCategoryStatusComplete())

    yield put(getSAdminGameCategoryStart({ limit, pageNo }))

    yield toast('Casino Category Status Updated Successfully', 'success')
  } catch (e) {
    yield put(updateCategoryStatusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * getAllCasinoProvidersWorker (action) {
  try {
    const { limit, pageNo } = action && action.payload
    const { data } = yield getAllCasinoProviders({
      limit,
      pageNo
    })

    yield put(getAllCasinoProvidersSuccess(data?.data?.casinos))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')

    yield put(getAllCasinoProvidersFailure(e?.response?.data?.message))
  }
}

function * resetCasinoGameWorker () {
  yield put(resetCasinoGameSuccess())
}

function * getAllCasinoGamesWorker (action) {
  try {
    const { bonusId, limit, pageNo, casinoCategoryId, search, isActive, selectedProvider, freespins } = action && action.payload

    const { data } = yield getAllCasinoGames({
      limit,
      pageNo,
      casinoCategoryId,
      search,
      isActive,
      selectedProvider,
      freespins: freespins || '',
      bonusId: bonusId || ''
    })

    yield put(getAllCasinoGamesSuccess(data?.data?.casinoGames))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllCasinoGamesFailure(e.response.data.message))
  }
}
function * createCasinoProviderWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload

    yield createCasinoProvider(objectToFormData(data))
    yield put(getAllCasinoProvidersStart({ limit, pageNo }))

    yield toast('Provider created', 'success', 'createCasinoProviderTaost')
    yield put(createCasinoProviderComplete())
  } catch (e) {
    yield put(createCasinoProviderComplete())

    yield toast(e?.response?.data?.message, 'error', 'createCasinoProviderTaost')
  }
}

function * createCasinoGameWorker (action) {
  try {
    const { data, casinoProviderId, limit, pageNo } = action && action.payload
    yield createCasinoGame(objectToFormData(data))

    yield toast('Game created', 'success')
    if (casinoProviderId) {
      yield put(getAllCasinoGamesStart({
        casinoProviderId,
        limit,
        pageNo
      }))
    }

    yield put(createCasinoGameComplete())
  } catch (e) {
    yield put(createCasinoGameComplete())

    yield toast(e?.response?.data?.message, 'error', 'createCasinoTaost')
  }
}

function * updateCasinoProviderWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload

    yield updateCasinoProvider(objectToFormData(data))

    yield toast('Provider updated', 'success', 'providerUpdateToast')
    yield put(getAllCasinoProvidersStart({ limit, pageNo }))

    yield put(updateCasinoProviderComplete())
  } catch (e) {
    yield put(updateCasinoProviderComplete())

    yield toast(e?.response?.data?.message, 'error', 'providerUpdateToast')
  }
}

function * updateCasinoGameWorker (action) {
  try {
    const { data, casinoProviderId, limit, pageNo } = action && action.payload

    yield updateCasinoGame(objectToFormData(data))

    yield put(updateCasinoGameComplete())

    yield put(getAllCasinoGamesStart({
      casinoProviderId,
      limit,
      pageNo
    }))

    yield toast('Game updated', 'success', 'gameUpdateToast')
  } catch (e) {
    yield put(updateCasinoGameComplete())

    yield toast(e?.response?.data?.message, 'error', 'gameUpdateToast')
  }
}

function * updateCasinoStatusWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload
    yield superAdminViewToggleStatus(data)
    yield toast('Status updated', 'success', 'updateCasinoToast')

    yield put(getAllCasinoProvidersStart({ limit, pageNo }))

    yield put(updateCasinoStatusComplete())
  } catch (e) {
    yield put(updateCasinoStatusComplete())

    yield toast(e?.response?.data?.message, 'error', 'updateCasinoToast')
  }
}

function * updateSACasinoGamesStatusWorker (action) {
  try {
    const {
      data,
      limit,
      pageNo,
      casinoCategoryId,
      search,
      isActive,
      selectedProvider
    } = action && action.payload

    yield superAdminViewToggleStatus(data)
    yield toast('Status updated', 'success', 'StatusUpdatedToast')

    yield put(getAllCasinoGamesStart({
      data,
      limit,
      pageNo,
      casinoCategoryId,
      search,
      isActive,
      selectedProvider
    }))

    yield put(updateSACasinoGamesStatusComplete())
  } catch (e) {
    yield put(updateSACasinoGamesStatusComplete())

    yield toast(e?.response?.data?.message, 'error', 'casinoGameStatusToast')
  }
}

function * getSAdminAggregatorsWorker (action) {
  try {
    const { limit, pageNo } = action && action.payload
    const { data } = yield getSAdminAggregators({
      limit,
      pageNo
    })

    yield put(getSAdminAggregatorsSuccess(data?.data?.aggregators))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error', 'aggregatorToast')

    yield put(getSAdminAggregatorsFailure(e?.response?.data?.message))
  }
}

function * createSAdminAggregatorWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload
    yield createSAdminAggregator(data)

    yield toast('Aggregator Created', 'success', 'aggregatorCreatedToast')

    yield put(createSAdminAggregatorComplete())
    yield put(getSAdminAggregatorsStart({ limit, pageNo }))
  } catch (e) {
    yield put(createSAdminAggregatorComplete())

    yield toast(e?.response?.data?.message, 'error', 'aggregatorCreatedToast')
  }
}

function * updateSAdminAggregatorStatusWorker (action) {
  try {
    const { data, limit, pageNo } = action && action.payload

    yield superAdminViewToggleStatus(data)

    yield toast('Status Updated', 'success')

    yield put(updateSAdminAggregatorStatusComplete())
    yield put(getSAdminAggregatorsStart({ limit, pageNo }))
  } catch (e) {
    yield put(updateSAdminAggregatorStatusComplete())

    yield toast(e?.response?.data?.message, 'error', 'aggregatorToast')
  }
}

function * getSAdminGameCategoryWorker (action) {
  try {
    const { limit, pageNo, search } = action && action.payload
    const { data } = yield getSAdminGameCategory({
      limit,
      pageNo
    })

    yield put(getSAdminGameCategorySuccess(data?.data?.casinoCategories))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error','gameCategoryToast')

    yield put(getSAdminGameCategoryFailure(e?.response?.data?.message))
  }
}

function * getSAdminGameSubCategoryWorker (action) {
  try {
    const { limit, pageNo, search, gameCategoryId, isActive } = action && action.payload
    const { data } = yield getSAdminGameSubCategory({
      limit,
      pageNo,
      search,
      gameCategoryId,
      isActive
    })

    yield put(getSAdminGameSubCategorySuccess(data?.data?.casinoSubCategories))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error', 'gameSubCategoryToast')

    yield put(getSAdminGameSubCategoryFailure(e?.response?.data?.message))
  }
}

function * getAllSAProvidersWorker () {
  try {
    const { data } = yield getAllSAProviders()

    yield put(getAllSAProvidersSuccess(data?.data?.providerList))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'providerToast')

    yield put(getAllSAProvidersFailure())
  }
}

function * getFreeSpinGamesWorker (action) {
  try {
    const { limit, pageNo, providerId, search, bonusId } = action && action.payload

    const { data } = yield getFreeSpinGames({
      limit, pageNo, providerId, search, bonusId
    })

    yield put(getFreeSpinGamesSuccess(data?.data?.gameWithFreespin))
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'freeSpinToast')

    yield put(getFreeSpinGamesFailure(e.response.data.message))
  }
}

function * updateReorderGamesWorker (action) {
  try {
    const { data, onSuccess } = action && action.payload
    const res = yield updateReorderGames({ data })

    yield put(updateReorderGamesSuccess())
    yield toast(res.data.message, 'success', 'reorderGameToast')
    onSuccess()
  } catch (e) {
    yield toast(e.response.data.message, 'error', 'reorderGameToast')

    yield put(updateReorderGamesFailure(e.response.data.message))
  }
}
