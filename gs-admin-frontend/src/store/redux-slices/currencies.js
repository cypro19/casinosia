import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllCurrenciesStart,
    getAllCurrenciesSuccess,
    getAllCurrenciesFailure,
    createCurrenciesStart,
    createCurrenciesSuccess,
    createCurrenciesFailure,
    editCurrencyStart,
    editCurrencySuccess,
    editCurrencyFailure,
    getCurrencyByIdStart,
    getCurrencyByIdSuccess,
    getCurrencyByIdFailure,
  },
  reducer
} = createSlice({
  name: 'currencies',
  initialState: {
    loading: false,
    error: null,
    success: false,
    allCurrencies: null,
    currency: null
  },
  reducers: {
    getAllCurrenciesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllCurrenciesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      allCurrencies: payload
    }),
    getAllCurrenciesFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    createCurrenciesStart: (state) => ({
      ...state,
      loading: true
    }),
    createCurrenciesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      allCurrencies: payload
    }),
    createCurrenciesFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    editCurrencyStart: (state) => ({
      ...state,
      loading: true
    }),
    editCurrencySuccess: (state) => ({
      ...state,
      loading: false,
      error: null,
      success: true
    }),
    editCurrencyFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    getCurrencyByIdStart: (state) => ({
      ...state,
      loading: true,
      error: null
    }),
    getCurrencyByIdSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      currency: payload
    }),
    getCurrencyByIdFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload
    })
  }
})

export default reducer

export {
  getAllCurrenciesStart,
  getAllCurrenciesSuccess,
  getAllCurrenciesFailure,
  createCurrenciesStart,
  createCurrenciesSuccess,
  createCurrenciesFailure,
  editCurrencyStart,
  editCurrencySuccess,
  editCurrencyFailure,
  getCurrencyByIdStart,
  getCurrencyByIdSuccess,
  getCurrencyByIdFailure
}
