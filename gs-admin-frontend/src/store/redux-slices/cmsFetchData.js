import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    createCmsStart,
    createCmsSuccess,
    createCmsFailure,
    updateCmsStatusStart,
    updateCmsStatusComplete,
    getUserDocumentStart,
    getUserDocumentSuccess,
    getUserDocumentFailure,
  },
  reducer
} = createSlice({
  name: 'cmsFetchData',
  initialState: {
    loading: false,
    error: null,
    success: false,
    cmsDetails: null,
    userDocuments: null,
    loyaltyPoint: null
  },
  reducers: {
    createCmsStart: (state) => ({
      ...state,
      loading: true
    }),
    createCmsSuccess: (state) => ({
      ...state,
      loading: false
    }),
    createCmsFailure: (state) => ({
      ...state,
      loading: false
    }),
    updateCmsStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateCmsStatusComplete: (state) => ({
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
    })
  }
})

export default reducer

export {
  createCmsStart,
  createCmsSuccess,
  createCmsFailure,
  updateCmsStatusStart,
  updateCmsStatusComplete,
  getUserDocumentStart,
  getUserDocumentSuccess,
  getUserDocumentFailure
}
