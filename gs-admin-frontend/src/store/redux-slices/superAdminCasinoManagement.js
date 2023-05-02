import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllCasinoProvidersStart,
    getAllCasinoProvidersSuccess,
    getAllCasinoProvidersFailure,
    createCasinoProviderStart,
    createCasinoProviderComplete,
    createCasinoCategoryStart,
    createCasinoCategoryComplete,
    getAllSubCategoriesStart,
    getAllSubCategoriesSuccess,
    getAllSubCategoriesFailure,
    createSubCategoryStart,
    createSubCategoryComplete,
    updateCasinoCategoryStart,
    updateCasinoCategoryComplete,
    updateSubCategoryStart,
    updateSubCategoryComplete,
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
    updateCategoryStatusStart,
    updateCategoryStatusComplete,
    updateCategoryReOrderStart,
    updateCategoryReOrderComplete,
    updateSubCategoryStatusStart,
    updateSubCategoryStatusComplete,
    getAllMasterGamesStart,
    getAllMasterGamesSuccess,
    getAllMasterGamesFailure,
    deleteCategoryStart,
    deleteCategoryComplete,
    deleteSubCategoryStart,
    deleteSubCategoryComplete,
    addGamesToSubCategoryStart,
    addGamesToSubCategoryComplete,
    getAllGamesStart,
    getAllGamesSuccess,
    getAllGamesFailure,
    deleteGameStart,
    deleteGameComplete,
    updateGameStatusStart,
    updateGameStatusComplete,
    updateGameStart,
    updateGameComplete,
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
    updateReorderGamesFailure
  },
  reducer
} = createSlice({
  name: 'fetchCasinoData',
  initialState: {
    loading: false,
    casinoProvidersData: null,
    casinoGamesData: null,
    aggregators: null,
    gameCategory: null,
    subCategories: null,
    allProviders: null,
    // casinoCategories: null,
    // subCategories: null,
    games: null,
    masterGames: null
  },
  reducers: {
    getAllCasinoProvidersStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllCasinoProvidersSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      casinoProvidersData: payload
    }),
    getAllCasinoProvidersFailure: (state) => ({
      ...state,
      loading: false
    }),
    getAllCasinoGamesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllSubCategoriesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllSubCategoriesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      subCategories: payload
    }),
    getAllSubCategoriesFailure: (state) => ({
      ...state,
      loading: false
    }),
    resetCasinoGameStart: (state) => ({
      ...state,
      loading: true
    }),
    resetCasinoGameSuccess: (state) => ({
      ...state,
      loading: false,
      casinoGamesData: null
    }),
    addGamesToSubCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    addGamesToSubCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    getAllCasinoGamesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      casinoGamesData: payload
    }),
    getAllCasinoGamesFailure: (state, { payload }) => ({
      ...state,
      loading: false
    }),
    getAllGamesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllGamesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      games: payload
    }),
    getAllGamesFailure: (state) => ({
      ...state,
      loading: false
    }),
    deleteGameStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteGameComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateGameStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateGameStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateGameStart: (state) => ({
      ...state,
      loading: true
    }),
    updateGameComplete: (state) => ({
      ...state,
      loading: false
    }),
    createCasinoGameStart: (state) => ({
      ...state,
      loading: true
    }),
    createCasinoGameComplete: (state) => ({
      ...state,
      loading: false
    }),
    createCasinoProviderStart: (state) => ({
      ...state,
      loading: true
    }),
    createCasinoProviderComplete: (state) => ({
      ...state,
      loading: false
    }),
    createCasinoCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    createCasinoCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateCasinoCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCasinoCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    deleteCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    deleteSubCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteSubCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateCategoryReOrderStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCategoryReOrderComplete: (state) => ({
      ...state,
      loading: false
    }),
    createSubCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    createSubCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateCasinoGameStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCasinoGameComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateSubCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSubCategoryComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateSubCategoryStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSubCategoryStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateCasinoProviderStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCasinoProviderComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateCasinoStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCasinoStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getSAdminAggregatorsStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAdminAggregatorsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      aggregators: payload
    }),
    getSAdminAggregatorsFailure: (state) => ({
      ...state,
      loading: false
    }),
    createSAdminAggregatorStart: (state) => ({
      ...state,
      loading: true
    }),
    createSAdminAggregatorComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateSAdminAggregatorStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSAdminAggregatorStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getSAdminGameCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAdminGameCategorySuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      gameCategory: payload
    }),
    getSAdminGameCategoryFailure: (state) => ({
      ...state,
      loading: false
    }),
    updateCategoryStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCategoryStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getSAdminGameSubCategoryStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAdminGameSubCategorySuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      gameSubCategory: payload
    }),
    getSAdminGameSubCategoryFailure: (state, { payload }) => ({
      ...state,
      loading: false
    }),
    updateSACasinoGamesStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSACasinoGamesStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getAllSAProvidersStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllSAProvidersSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      allProviders: payload
    }),
    getAllSAProvidersFailure: (state, { payload }) => ({
      ...state,
      loading: false
    }),
    getFreeSpinGamesStart: (state) => ({
      ...state,
      loading: true
    }),
    getFreeSpinGamesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      casinoGamesData: payload
    }),
    getFreeSpinGamesFailure: (state) => ({
      ...state,
      loading: false
    }),
    getAllMasterGamesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllMasterGamesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      masterGames: payload
    }),
    getAllMasterGamesFailure: (state) => ({
      ...state,
      loading: false
    }),
    updateReorderGamesStart: (state) => ({
      ...state,
      loading: true
    }),
    updateReorderGamesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      reorderGames: payload
    }),
    updateReorderGamesFailure: (state) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  getAllCasinoProvidersStart,
  getAllCasinoProvidersSuccess,
  getAllCasinoProvidersFailure,
  createCasinoProviderStart,
  createCasinoProviderComplete,
  updateCasinoProviderStart,
  updateCasinoProviderComplete,
  getAllCasinoGamesStart,
  getAllCasinoGamesSuccess,
  getAllCasinoGamesFailure,
  getAllSubCategoriesStart,
  getAllSubCategoriesSuccess,
  getAllSubCategoriesFailure,
  getAllGamesStart,
  getAllGamesSuccess,
  getAllGamesFailure,
  deleteGameStart,
  deleteGameComplete,
  updateGameStatusStart,
  updateGameStatusComplete,
  updateGameStart,
  updateGameComplete,
  createCasinoGameStart,
  createCasinoGameComplete,
  createCasinoCategoryStart,
  createCasinoCategoryComplete,
  updateCasinoCategoryStart,
  updateCasinoCategoryComplete,
  updateSubCategoryStart,
  updateSubCategoryComplete,
  createSubCategoryStart,
  createSubCategoryComplete,
  updateCasinoGameStart,
  updateCasinoGameComplete,
  updateSubCategoryStatusStart,
  updateSubCategoryStatusComplete,
  updateCategoryReOrderStart,
  updateCategoryReOrderComplete,
  deleteCategoryStart,
  deleteCategoryComplete,
  deleteSubCategoryStart,
  deleteSubCategoryComplete,
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
  updateCategoryStatusStart,
  updateCategoryStatusComplete,
  getSAdminGameSubCategoryStart,
  getSAdminGameSubCategorySuccess,
  getSAdminGameSubCategoryFailure,
  getAllMasterGamesStart,
  getAllMasterGamesSuccess,
  getAllMasterGamesFailure,
  updateSACasinoGamesStatusStart,
  updateSACasinoGamesStatusComplete,
  addGamesToSubCategoryStart,
  addGamesToSubCategoryComplete,
  getAllSAProvidersStart,
  getAllSAProvidersSuccess,
  getAllSAProvidersFailure,
  getFreeSpinGamesStart,
  getFreeSpinGamesSuccess,
  getFreeSpinGamesFailure,
  updateReorderGamesStart,
  updateReorderGamesSuccess,
  updateReorderGamesFailure
}
