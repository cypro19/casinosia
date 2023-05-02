import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllWithdrawRequestStart,
    getAllWithdrawRequestSuccess,
    getAllWithdrawRequestFailure,
    getAdminUserDetailsStart,
    getAdminUserDetailsSuccess,
    getAdminUserDetailsFailure,
    createSAdminUserStart,
    createSAdminUserComplete,
    updateSAdminUserStart,
    updateSAdminUserComplete,
    updateSAdminStatusStart,
    updateSAdminStatusComplete,
    getAllGroupsStart,
    getAllGroupsSuccess,
    getAllGroupsFailure,
  },
  reducer
} = createSlice({
  name: 'adminUser',
  initialState: {
    loading: false,
    error: null,
    adminUsers: [],
    adminUserDetails: {},
    withdrawRequests: null,
    groups: []
  },
  reducers: {
    getAllWithdrawRequestStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllWithdrawRequestSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      withdrawRequests: payload
    }),
    getAllWithdrawRequestFailure: (state) => ({
      ...state,
      loading: false
    }),

    getAdminUserDetailsStart: (state) => ({
      ...state,
      loading: true
    }),
    getAdminUserDetailsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      adminUserDetails: payload
    }),
    getAdminUserDetailsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    updateSAdminUserStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSAdminUserComplete: (state) => ({
      ...state,
      loading: false
    }),
    createSAdminUserStart: (state) => ({
      ...state,
      loading: true
    }),
    createSAdminUserComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateSAdminStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSAdminStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getAllGroupsStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllGroupsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      groups: payload
    }),
    getAllGroupsFailure: (state, { payload }) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer
export {
  getAllWithdrawRequestStart,
  getAllWithdrawRequestSuccess,
  getAllWithdrawRequestFailure,
  getAdminUserDetailsStart,
  getAdminUserDetailsSuccess,
  getAdminUserDetailsFailure,
  updateSAdminUserStart,
  updateSAdminUserComplete,
  createSAdminUserStart,
  createSAdminUserComplete,
  updateSAdminStatusStart,
  updateSAdminStatusComplete,
  getAllGroupsStart,
  getAllGroupsSuccess,
  getAllGroupsFailure
}
