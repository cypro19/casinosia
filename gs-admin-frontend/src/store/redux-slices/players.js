import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllCredentialsStart,
    getAllCredentialsSuccess,
    getAllCredentialsFailure,
    createCredentialsStart,
    createCredentialsSuccess,
    createCredentialsFailure,
    updateCredentialsStart,
    updateCredentialsSuccess,
    updateCredentialsFailure,
    addDepositToOtherStart,
    addDepositToOtherCompleted,
    getAllClientsStart,
    getAllClientsSuccess,
    getAllClientsFailure,
    getOwnerPermissionStart,
    getOwnerPermissionSuccess,
    getOwnerPermissionFailure
  },
  reducer
} = createSlice({
  name: 'getAllAdmins',
  initialState: {
    loading: false,
    error: null,
    success: false,
    allCredentialsKey: [],
    ownerPermission: {},
    permissionLoading: false
  },
  reducers: {
    getAllCredentialsStart: (state) => ({
      ...state,
      loading: true,
      error: null,
      success: false
    }),
    getAllCredentialsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      allCredentialsKey: payload
    }),
    getAllCredentialsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    createCredentialsStart: (state) => ({
      ...state,
      loading: true,
      error: null,
      success: false
    }),
    createCredentialsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true
    }),
    createCredentialsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    updateCredentialsStart: (state) => ({
      ...state,
      loading: true,
      error: null,
      success: false
    }),
    updateCredentialsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true
    }),
    updateCredentialsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    addDepositToOtherStart: (state) => ({
      ...state,
      loading: true,
      error: null
    }),
    addDepositToOtherCompleted: (state) => ({
      ...state,
      loading: false
    }),
    getAllClientsStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllClientsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      clientsFilterData: payload
    }),
    getAllClientsFailure: (state) => ({
      ...state,
      loading: false
    }),
    getOwnerPermissionStart: (state) => ({
      ...state,
      permissionLoading: true
    }),
    getOwnerPermissionSuccess: (state, { payload }) => ({
      ...state,
      permissionLoading: false,
      ownerPermission: { ...payload, CMS: ['R', 'U', 'T'], Users: ['R', 'U', 'T', 'AB', 'SR'], Bonus: ['R', 'U', 'C', 'T', 'Issue'] }
    }),
    getOwnerPermissionFailure: (state) => ({
      ...state,
      permissionLoading: false
    })
  }
})

export default reducer

export {
  getAllCredentialsStart,
  getAllCredentialsSuccess,
  getAllCredentialsFailure,
  createCredentialsStart,
  createCredentialsSuccess,
  createCredentialsFailure,
  updateCredentialsStart,
  updateCredentialsSuccess,
  updateCredentialsFailure,
  addDepositToOtherStart,
  addDepositToOtherCompleted,
  getAllClientsStart,
  getAllClientsSuccess,
  getAllClientsFailure,
  getOwnerPermissionStart,
  getOwnerPermissionSuccess,
  getOwnerPermissionFailure
}
