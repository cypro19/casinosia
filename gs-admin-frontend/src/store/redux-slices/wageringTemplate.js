import { createSlice } from '@reduxjs/toolkit'
const {
  actions: {
    getWageringTemplateDetailStart,
    getWageringTemplateDetailSuccess,
    getWageringTemplateDetailFailure
  },
  reducer
} = createSlice({
  name: 'wageringTemplate',
  initialState: {
    loading: false,
    wageringTemplateDetail: null
  },
  reducers: {
    getWageringTemplateDetailStart: (state) => ({
      ...state,
      loading: true,
      wageringTemplateDetail: null
    }),
    getWageringTemplateDetailSuccess: (state, { payload }) => ({
      ...state,
      wageringTemplateDetail: payload
    }),
    getWageringTemplateDetailFailure: (state, { payload }) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  getWageringTemplateDetailStart,
  getWageringTemplateDetailSuccess,
  getWageringTemplateDetailFailure
}
