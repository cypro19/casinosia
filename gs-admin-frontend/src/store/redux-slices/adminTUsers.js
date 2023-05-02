import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllWithdrawRequestStart,
    getAllWithdrawRequestSuccess,
    getAllWithdrawRequestFailure,
    updateLimitsStart,
    updateLimitsComplete,
    disableUserStart,
    disableUserComplete
  },
  reducer
} = createSlice({
  name: 'players',
  initialState: {
    error: null,
    loading: false,
    allUsers: null,
    user: null,
    userFields: null,
    withdrawRequests: null,
    tags: [],
    duplicateUsers: [],
    duplicateLoading: false,
    limitsLoading: false
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
    updateLimitsStart: (state) => ({
      ...state,
      limitsLoading: true
    }),
    updateLimitsComplete: (state) => ({
      ...state,
      limitsLoading: false
    }),
    disableUserStart: (state) => ({
      ...state,
      limitsLoading: true
    }),
    disableUserComplete: (state) => ({
      ...state,
      limitsLoading: false
    })
  }
})

export default reducer

export {
  getAllWithdrawRequestStart,
  getAllWithdrawRequestSuccess,
  getAllWithdrawRequestFailure,
  updateLimitsStart,
  updateLimitsComplete,
  disableUserStart,
  disableUserComplete
}
