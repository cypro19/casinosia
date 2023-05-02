import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getSAConvertAmountStart,
    getSAConvertAmountSuccess,
    getSAConvertAmountFailure,
    createBonusStart,
    createBonusComplete,
    updateBonusStart,
    updateBonusComplete,
    getBonusStart,
    getBonusSuccess,
    getBonusFailure,
    issueBonusStart,
    issueBonusComplete,
    getUserBonusStart,
    getUserBonusSuccess,
    getUserBonusFailure,
    cancelBonusStart,
    cancelBonusComplete,
    updateSABonusStatusStart,
    updateSABonusStatusComplete,
    getSAPaymentMethodStart,
    getSAPaymentMethodSuccess,
    getSAPaymentMethodFailure
  },
  reducer
} = createSlice({
  name: 'bonus',
  initialState: {
    loading: false,
    convertedAmount: null,
    bonusDetail: null,
    userBonus: null,
    paymentMethod: null,
    languages: [],
    langLoading: false
  },
  reducers: {
    getSAConvertAmountStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAConvertAmountSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      convertedAmount: payload
    }),
    getSAConvertAmountFailure: (state, { payload }) => ({
      ...state,
      loading: false
    }),
    createBonusStart: (state) => ({
      ...state,
      loading: true
    }),
    createBonusComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateBonusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateBonusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getBonusStart: (state) => ({
      ...state,
      loading: true,
      bonusDetail: null
    }),
    getBonusSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      bonusDetail: payload
    }),
    getBonusFailure: (state, { payload }) => ({
      ...state,
      loading: false
    }),
    issueBonusStart: (state) => ({
      ...state,
      loading: true
    }),
    issueBonusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getUserBonusStart: (state) => ({
      ...state,
      loading: true
    }),
    getUserBonusSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      userBonus: payload
    }),
    getUserBonusFailure: (state) => ({
      ...state,
      loading: false
    }),
    cancelBonusStart: (state) => ({
      ...state,
      loading: true
    }),
    cancelBonusComplete: (state) => ({
      ...state,
      loading: false
    }),
    updateSABonusStatusStart: (state) => ({
      ...state,
      loading: true
    }),
    updateSABonusStatusComplete: (state) => ({
      ...state,
      loading: false
    }),
    getSAPaymentMethodStart: (state) => ({
      ...state,
      loading: true
    }),
    getSAPaymentMethodSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      paymentMethod: payload
    }),
    getSAPaymentMethodFailure: (state, { payload }) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  getSAConvertAmountStart,
  getSAConvertAmountSuccess,
  getSAConvertAmountFailure,
  createBonusStart,
  createBonusComplete,
  updateBonusStart,
  updateBonusComplete,
  getBonusStart,
  getBonusSuccess,
  getBonusFailure,
  issueBonusStart,
  issueBonusComplete,
  getUserBonusStart,
  getUserBonusSuccess,
  getUserBonusFailure,
  cancelBonusStart,
  cancelBonusComplete,
  updateSABonusStatusStart,
  updateSABonusStatusComplete,
  getSAPaymentMethodStart,
  getSAPaymentMethodSuccess,
  getSAPaymentMethodFailure
}
