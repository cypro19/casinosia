import { createSlice } from '@reduxjs/toolkit'

const {
  actions: { getAllThemeStart, getAllThemeSuccess, getAllThemeFailure, updateThemeStart, updateThemeSuccess, updateThemeFailure, createThemeStart, createThemeSuccess, createThemeFailure },
  reducer
} = createSlice({
  name: 'theme',
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null
  },
  reducers: {
    getAllThemeStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllThemeSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      error: null,
      success: true,
      data: payload
    }),
    getAllThemeFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      success: false
    }),
    updateThemeStart: (state) => ({
      ...state,
      loading: true
    }),
    updateThemeSuccess: (state) => ({
      ...state,
      loading: false,
      success: true
    }),
    updateThemeFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      success: false,
      error: payload
    }),
    createThemeStart: (state) => ({
      ...state,
      loading: true
    }),
    createThemeSuccess: (state) => ({
      ...state,
      loading: false,
      success: true
    }),
    createThemeFailure: (state, { payload }) => ({
      ...state,
      loading: false,
      success: false,
      error: payload
    })
  }
})

export default reducer

export { getAllThemeStart, getAllThemeSuccess, getAllThemeFailure, updateThemeStart, updateThemeSuccess, updateThemeFailure, createThemeStart, createThemeSuccess, createThemeFailure }
