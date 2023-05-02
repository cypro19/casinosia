import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
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
  },
  reducer
} = createSlice({
  name: 'settings',
  initialState: {
    loading: false,
    documentLabels: null,
    loyaltyLevel: null,
    SABanners: null
  },
  reducers: {
    getDocumentLabelStart: (state) => ({
      ...state,
      loading: true
    }),
    getDocumentLabelSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      documentLabels: payload
    }),
    getDocumentLabelFailure: (state) => ({
      ...state,
      loading: false
    }),
    updateDocumentLabelStart: (state) => ({
      ...state,
      loading: true
    }),
    updateDocumentLabelComplete: (state) => ({
      ...state,
      loading: false
    }),
    createDocumentLabelStart: (state) => ({
      ...state,
      loading: true
    }),
    createDocumentLabelComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateDocumentStart: (state) => ({
      ...state,
      loading: true
    }),
    updateDocumentComplete: (state) => ({
      ...state,
      loading: false
    }),
    getloyaltyLevelStart: (state) => ({
      ...state,
      loading: true
    }),
    getloyaltyLevelSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      loyaltyLevel: payload
    }),
    getloyaltyLevelFailure: (state) => ({
      ...state,
      loading: false
    }),
    updateloyaltyLevelStart: (state) => ({
      ...state,
      loading: true
    }),
    updateloyaltyLevelComplete: (state) => ({
      ...state,
      loading: false
    }),
    getAllSABannersStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllSABannersSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      SABanners: payload
    }),
    getAllSABannersFailure: (state) => ({
      ...state,
      loading: false
    }),
    updateSABannerStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSABannerComplete: (state) => ({
      ...state,
      loading: false
    }),
    uploadSABannerStart: (state) => ({
      ...state,
      loading: true
    }),
    uploadSABannerComplete: (state) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
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
}
