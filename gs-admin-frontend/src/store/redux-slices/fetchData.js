import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllAffiliatesStart,
    getAllAffiliatesSuccess,
    getAllAffiliatesFailure,
    getAllCmsStart,
    getAllCmsSuccess,
    getAllCmsFailure,
    clearAllCms,
    getAllUsersStart,
    getAllUsersSuccess,
    getAllUsersFailure,
    clearAllUsers,
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
    getGlobalRegistrationCompleted,
    getGlobalRegistrationFailed,
    updateGlobalRegistrationStart,
    updateGlobalRegistrationCompleted,
    updateGlobalRegistrationFailed,
    getUserDocumentStart,
    getUserDocumentSuccess,
    getUserDocumentFailure,
    verifyUserDocumentStart,
    verifyUserDocumentComplete,
    updateSACMSStatusStart,
    updateSACMSStatusComplete,
    getCMSDynamicKeysStart,
    getCMSDynamicKeysSuccess,
    getCMSDynamicKeysFailure,
    deleteCMSLanguageStart,
    deleteCMSLanguageComplete
  },
  reducer
} = createSlice({
  name: 'fetchData',
  initialState: {
    loading: false,
    error: null,
    success: false,
    affiliatesData: null,
    cmsData: null,
    userData: null,
    affiliateByIdData: null,
    cmsByPageIdData: null,
    countries: null,
    restrictedItems: null,
    unRestrictedItems: null,
    restrictedCountries: null,
    unRestrictedCountries: null,
    userDocuments: null,
    keysLoading: false,
    cmsKeys: null
  },
  reducers: {
    getAllAffiliatesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllAffiliatesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      affiliatesData: payload
    }),
    getAllAffiliatesFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getAffiliateByIdStart: (state) => ({
      ...state,
      loading: true
    }),
    getAffiliateByIdSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      affiliateByIdData: payload
    }),
    getAffiliateByIdFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getAllCmsStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllCmsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      cmsData: payload
    }),
    getAllCmsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    clearAllCms: (state) => ({
      ...state,
      cmsData: null
    }),
    getCmsByPageIdStart: (state) => ({
      ...state,
      loading: true
    }),
    getCmsByPageIdSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      cmsByPageIdData: payload
    }),
    getCmsByPageIdFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getAllUsersStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllUsersSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      userData: payload
    }),
    getAllUsersFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    clearAllUsers: (state) => ({
      ...state,
      userData: null
    }),
    getUserStart: (state) => ({
      ...state,
      loading: true
    }),
    getUserSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      userData: payload
    }),
    getUserFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getCountriesStart: (state) => ({
      ...state,
      loading: true
    }),
    getCountriesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      countries: payload
    }),
    getCountriesFailure: (state) => ({
      ...state,
      loading: false
    }),
    getRestrictedItemsStart: (state) => ({
      ...state,
      loading: true
    }),
    getRestrictedItemsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      restrictedItems: payload
    }),
    getRestrictedItemsFailure: (state) => ({
      ...state,
      loading: false
    }),
    getUnRestrictedItemsStart: (state) => ({
      ...state,
      loading: true
    }),
    getUnRestrictedItemsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      unRestrictedItems: payload
    }),
    getUnRestrictedItemsFailure: (state) => ({
      ...state,
      loading: false
    }),
    addRestrictedItemsStart: (state) => ({
      ...state,
      loading: true
    }),
    addRestrictedItemsComplete: (state) => ({
      ...state,
      loading: false
    }),
    deleteRestrictedItemsStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteRestrictedItemsComplete: (state) => ({
      ...state,
      loading: false
    }),
    resetRestrictedItemsStart: (state) => ({
      ...state
    }),
    resetRestrictedItemsComplete: (state) => ({
      ...state,
      restrictedItems: null,
      unRestrictedItems: null
    }),
    getRestrictedCountriesStart: (state) => ({
      ...state,
      loading: true
    }),
    getRestrictedCountriesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      restrictedCountries: payload
    }),
    getRestrictedCountriesFailure: (state) => ({
      ...state,
      loading: false
    }),
    getUnRestrictedCountriesStart: (state) => ({
      ...state,
      loading: true
    }),
    getUnRestrictedCountriesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      unRestrictedCountries: payload
    }),
    getUnRestrictedCountriesFailure: (state) => ({
      ...state,
      loading: false
    }),
    addRestrictedCountriesStart: (state) => ({
      ...state,
      loading: true
    }),
    addRestrictedCountriesComplete: (state) => ({
      ...state,
      loading: false
    }),
    deleteRestrictedCountriesStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteRestrictedCountriesComplete: (state) => ({
      ...state,
      loading: false
    }),
    resetRestrictedCountriesStart: (state) => ({
      ...state
    }),
    resetRestrictedCountriesComplete: (state) => ({
      ...state,
      restrictedCountries: null,
      unRestrictedCountries: null
    }),
    updateSAdminCMSStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSAdminCMSComplete: (state) => ({
      ...state,
      loading: false
    }),
    getGlobalRegistrationStart: (state) => ({
      ...state,
      loading: true
    }),
    getGlobalRegistrationCompleted: (state, { payload }) => ({
      ...state,
      loading: false,
      formFields: payload
    }),
    getGlobalRegistrationFailed: (state) => ({
      ...state,
      loading: false
    }),
    updateGlobalRegistrationStart: (state) => ({
      ...state,
      loading: true
    }),
    updateGlobalRegistrationCompleted: (state) => ({
      ...state,
      loading: false
    }),
    updateGlobalRegistrationFailed: (state) => ({
      ...state,
      loading: false
    }),
    getUserDocumentStart: (state) => ({
      ...state,
      loading: true
    }),
    getUserDocumentSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      userDocuments: payload
    }),
    getUserDocumentFailure: (state) => ({
      ...state,
      loading: false
    }),
    verifyUserDocumentStart: (state) => ({
      ...state,
      loading: true
    }),
    verifyUserDocumentComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateSACMSStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSACMSStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getCMSDynamicKeysStart: (state) => ({
      ...state,
      keysLoading: true
    }),
    getCMSDynamicKeysSuccess: (state, { payload }) => ({
      ...state,
      keysLoading: false,
      cmsKeys: payload
    }),
    getCMSDynamicKeysFailure: (state) => ({
      ...state,
      keysLoading: false
    }),
    deleteCMSLanguageStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteCMSLanguageComplete: (state) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  getAllAffiliatesStart,
  getAllAffiliatesSuccess,
  getAllAffiliatesFailure,
  getAllCmsStart,
  getAllCmsSuccess,
  getAllCmsFailure,
  clearAllCms,
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
  getCmsByPageIdFailure,
  getCmsByPageIdSuccess,
  getCountriesStart,
  getCountriesSuccess,
  getCountriesFailure,
  clearAllUsers,
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
  getGlobalRegistrationCompleted,
  getGlobalRegistrationFailed,
  updateGlobalRegistrationStart,
  updateGlobalRegistrationCompleted,
  updateGlobalRegistrationFailed,
  getUserDocumentStart,
  getUserDocumentSuccess,
  getUserDocumentFailure,
  verifyUserDocumentStart,
  verifyUserDocumentComplete,
  updateSACMSStatusStart,
  updateSACMSStatusComplete,
  getCMSDynamicKeysStart,
  getCMSDynamicKeysSuccess,
  getCMSDynamicKeysFailure,
  deleteCMSLanguageStart,
  deleteCMSLanguageComplete
}
