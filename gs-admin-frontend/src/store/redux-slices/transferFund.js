import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    depositToOwnerStart,
    depositToOwnerComplete
  },
  reducer
} = createSlice({
  name: 'tranferFund',
  initialState: {
    loading: false
  },
  reducers: {
    depositToOwnerStart: (state) => ({
      ...state,
      loading: true
    }),
    depositToOwnerComplete: (state) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  depositToOwnerStart,
  depositToOwnerComplete
}
