import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllAdminsStart,
    getAllAdminsSuccess,
    getAllAdminsFailure,
    updateAdminStatusStart,
    updateAdminStatusSuccess,
    updateAdminStatusFailure,
    getAdminDetailsStart,
    getAdminDetailsSuccess,
    getAdminDetailsFailure,
    getSAdminDetailsStart,
    getSAdminDetailsSuccess,
    getSAdminDetailsFailure,
    getAllBonusStart,
    getAllBonusComplete,
    getAllBonusFailure,
    getAdminChildrenStart,
    getAdminChildrenSuccess,
    getAdminChildrenFailure,
    resetAdminChildren,
    getAdminDataStart,
    getAdminDataSuccess,
    getAdminDataFailure
  },
  reducer
} = createSlice({
  name: 'admins',
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null,
    adminDetails: null,
    adminRoleId: null,
    adminPermissions: null,
    adminChildren: null,
    adminData: null
  },
  reducers: {
    getAllAdminsStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllAdminsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      data: payload
    }),
    getAllAdminsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    updateAdminStatusStart: (state) => ({
      ...state,
      loading: true,
      error: null,
      success: false
    }),
    updateAdminStatusSuccess: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: true
    }),
    updateAdminStatusFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getAdminDetailsStart: (state) => ({
      ...state,
      loading: true
    }),
    getAdminDetailsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      adminDetails: payload
    }),
    getAdminDetailsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getSAdminDetailsStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAdminDetailsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      adminDetails: payload,
      adminPermissions: payload?.userPermission?.permission,
      adminRoleId: payload?.superRoleId
    }),
    getSAdminDetailsFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getAllBonusStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllBonusComplete: (state, { payload }) => ({
      ...state,
      loading: false,
      bonusList: payload

    }),
    getAllBonusFailure: (state) => ({
      ...state,
      loading: false
    }),
    getAdminChildrenStart: (state) => ({
      ...state,
      loading: true
    }),
    getAdminChildrenSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      adminChildren: payload
    }),
    getAdminChildrenFailure: (state, { payload }) => ({
      ...state,
      loading: false
    }),
    resetAdminChildren: (state) => ({
      ...state,
      loading: false,
      adminChildren: null
    }),
    getAdminDataStart: (state) => ({
      ...state,
      loading: true,
      adminData: null
    }),
    getAdminDataSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      adminData: payload
    }),
    getAdminDataFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    })

  }
})

export default reducer

export {
  getAllAdminsStart,
  getAllAdminsSuccess,
  getAllAdminsFailure,
  getAdminChildrenStart,
  getAdminChildrenSuccess,
  getAdminChildrenFailure,
  updateAdminStatusStart,
  updateAdminStatusSuccess,
  updateAdminStatusFailure,
  getAdminDetailsStart,
  getAdminDetailsSuccess,
  getAdminDetailsFailure,
  getSAdminDetailsStart,
  getSAdminDetailsSuccess,
  getSAdminDetailsFailure,
  getAllBonusStart,
  getAllBonusComplete,
  getAllBonusFailure,
  resetAdminChildren,
  getAdminDataStart,
  getAdminDataSuccess,
  getAdminDataFailure
}
