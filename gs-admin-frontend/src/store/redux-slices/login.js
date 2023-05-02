import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    superAdminLoginStart,
    superAdminLoginSuccess,
    superAdminLoginFailure,
    getAdminRoleStart,
    getAdminRoleSuccess,
    getAdminRoleFailure,
    getSAdminWalletStart,
    getSAdminWalletSuccess,
    getSAdminWalletFailure,
    getLanguagesStart,
    getLanguagesSuccess,
    getLanguagesFailure,
    getActiveLanguagesStart,
    getActiveLanguagesSuccess,
    getActiveLanguagesFailure,
    updateProfileStart,
    updateProfileComplete,
    setEmailCredsStart,
    setEmailCredsComplete,
    setSiteConfigurationStart,
    setSiteConfigurationComplete,
    updateLanguageStatusStart,
    updateLanguageStatusComplete,
    setProfileTab
  },
  reducer
} = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    siteConfigLoading: false,
    isLoggedIn: false,
    error: null,
    success: false,
    role: null,
    adminRole: null,
    wallets: null,
    languages: null,
    activeLanguages: null,
    languageLoading: false,
    profileTab: 'overview'
  },
  reducers: {
    superAdminLoginStart: (state) => ({
      ...state,
      loading: true
    }),
    superAdminLoginSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      isLoggedIn: true,
      error: null,
      success: true,
      role: payload
    }),
    superAdminLoginFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      isLoggedIn: false,
      error: payload,
      success: false
    }),
    updateLanguageStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateLanguageStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getAdminRoleStart: (state) => ({
      ...state,
      loading: true
    }),
    getAdminRoleSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      adminRole: payload
    }),
    getAdminRoleFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    setProfileTab: (state, { payload }) => ({
      ...state,
      profileTab: payload
    }),
    getSAdminWalletStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAdminWalletSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      wallets: payload
    }),
    getSAdminWalletFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getLanguagesStart: (state) => ({
      ...state,
      languageLoading: true
    }),
    getLanguagesSuccess: (state, { payload }) => ({
      ...state,
      languageLoading: false,
      languages: payload
    }),
    getLanguagesFailure: (state) => ({
      ...state,
      languageLoading: false
    }),
    getActiveLanguagesStart: (state) => ({
      ...state,
      languageLoading: true
    }),
    getActiveLanguagesSuccess: (state, { payload }) => ({
      ...state,
      languageLoading: false,
      activeLanguages: payload
    }),
    getActiveLanguagesFailure: (state) => ({
      ...state,
      languageLoading: false
    }),
    updateProfileStart: (state) => ({
      ...state,
      loading: true
    }),
    updateProfileComplete: (state) => ({
      ...state,
      loading: false
    }),
    setEmailCredsStart: (state) => ({
      ...state,
      loading: true
    }),
    setEmailCredsComplete: (state) => ({
      ...state,
      loading: false,
      success: true
    }),
    setSiteConfigurationStart: (state) => ({
      ...state,
      siteConfigLoading: true
    }),
    setSiteConfigurationComplete: (state) => ({
      ...state,
      siteConfigLoading: false,
      success: true
    }),
    resetCredUpdate: (state) => ({
      ...state,
      success: false
    })
  }
})

export default reducer

export {
  superAdminLoginStart,
  superAdminLoginSuccess,
  superAdminLoginFailure,
  getAdminRoleStart,
  getAdminRoleSuccess,
  getAdminRoleFailure,
  getSAdminWalletStart,
  getSAdminWalletSuccess,
  getSAdminWalletFailure,
  getLanguagesStart,
  getLanguagesSuccess,
  getLanguagesFailure,
  getActiveLanguagesStart,
  getActiveLanguagesSuccess,
  getActiveLanguagesFailure,
  updateProfileStart,
  updateProfileComplete,
  updateLanguageStatusStart,
  updateLanguageStatusComplete,
  setEmailCredsStart,
  setEmailCredsComplete,
  setSiteConfigurationStart,
  setSiteConfigurationComplete,
  setProfileTab
}
