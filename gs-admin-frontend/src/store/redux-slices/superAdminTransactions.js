import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllSAdminTransactionsStart,
    getAllSAdminTransactionsSuccess,
    getAllSAdminTransactionsFailure,
    getSAdminCasinoTransactionsStart,
    getSAdminCasinoTransactionsSuccess,
    getSAdminCasinoTransactionsFailure
  },
  reducer
} = createSlice({
  name: 'transactions',
  initialState: {
    loading: false,
    transactions: {},
    casinoTransactions: {}
  },
  reducers: {
    getAllSAdminTransactionsStart: (state) => ({
      ...state,
      loading: true,
      error: null
    }),
    getAllSAdminTransactionsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      transactions: payload
    }),
    getAllSAdminTransactionsFailure: (state) => ({
      ...state,
      loading: false
    }),
    getSAdminCasinoTransactionsStart: (state) => ({
      ...state,
      loading: true,
      error: null
    }),
    getSAdminCasinoTransactionsSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      casinoTransactions: payload
    }),
    getSAdminCasinoTransactionsFailure: (state) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  getAllSAdminTransactionsStart,
  getAllSAdminTransactionsSuccess,
  getAllSAdminTransactionsFailure,
  getSAdminCasinoTransactionsStart,
  getSAdminCasinoTransactionsSuccess,
  getSAdminCasinoTransactionsFailure
}
