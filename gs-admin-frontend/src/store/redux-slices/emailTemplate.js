import { createSlice } from '@reduxjs/toolkit'

const {
  actions: {
    getAllemailTemplatesStart,
    getAllemailTemplatesComplete,
    getemailTemplateStart,
    getemailTemplateComplete,
    updateEmailTemplateStart,
    updateEmailTemplateComplete,
    createEmailTemplateComplete,
    createEmailTemplateStart,
    emailTemplateFailure,
    resetEmailTemplate,
    makePrimaryEmailTemplatesStart,
    makePrimaryEmailTemplatesComplete,
    getDynamicKeysStart,
    getDynamicKeysComplete,
    getImageGalleryStart,
    getImageGallerySuccess,
    getImageGalleryFailure,
    deleteFromGalleryStart,
    deleteFromGalleryComplete,
    testEmailTemplateStart,
    testEmailTemplateSuccess,
    testEmailTemplateFailure,
    deleteEmailTemplateLanguageStart,
    deleteEmailTemplateLanguageComplete,
    getEmailTypesStart,
    getEmailTypesSuccess,
    getEmailTypesFailure
  },
  reducer
} = createSlice({
  name: 'emailTemplate',
  initialState: {
    loading: false,
    imageLoading: false,
    emailTemplates: {},
    templateCount: 0,
    emailTemplate: null,
    dynamicKeys: {},
    gallery: [],
    emailTemplateOrder: [],
    emailTypes: null,
    keyLoading: false
  },
  reducers: {
    getAllemailTemplatesStart: (state) => ({
      ...state,
      loading: true
    }),
    getAllemailTemplatesComplete: (state, { payload }) => ({
      ...state,
      loading: false,
      emailTemplates: payload?.emailTemplate,
      templateCount: payload.templateCount,
      emailTemplateOrder: payload?.emailTemplateOrder
    }),
    getemailTemplateStart: (state) => ({
      ...state,
      loading: true
    }),
    getemailTemplateComplete: (state, { payload }) => ({
      ...state,
      loading: false,
      emailTemplate: payload

    }),
    updateEmailTemplateStart: (state) => ({
      ...state,
      loading: true
    }),
    updateEmailTemplateComplete: (state) => ({
      ...state,
      loading: false
    }),
    makePrimaryEmailTemplatesStart: (state) => ({
      ...state,
      loading: true
    }),
    makePrimaryEmailTemplatesComplete: (state) => ({
      ...state,
      loading: false
    }),
    createEmailTemplateStart: (state) => ({
      ...state,
      loading: true
    }),
    createEmailTemplateComplete: (state) => ({
      ...state,
      loading: false
    }),
    getDynamicKeysStart: (state) => ({
      ...state,
      keyLoading: true
    }),
    getDynamicKeysComplete: (state, { payload }) => ({
      ...state,
      keyLoading: false,
      dynamicKeys: payload
    }),
    resetEmailTemplate: (state) => ({
      ...state,
      keyLoading: false,
      emailTemplate: null
    }),
    emailTemplateFailure: (state) => ({
      ...state,
      loading: false
    }),
    getImageGalleryStart: (state) => ({
      ...state,
      imageLoading: true
    }),
    getImageGallerySuccess: (state, { payload }) => ({
      ...state,
      imageLoading: false,
      gallery: payload
    }),
    getImageGalleryFailure: (state) => ({
      ...state,
      imageLoading: false
    }),
    deleteFromGalleryStart: (state) => ({
      ...state,
      imageLoading: true
    }),
    deleteFromGalleryComplete: (state) => ({
      ...state,
      imageLoading: false
    }),
    testEmailTemplateStart: (state) => ({
      ...state,
      testTemplateLoading: true
    }),
    testEmailTemplateSuccess: (state, { payload }) => ({
      ...state,
      testTemplateLoading: false
    }),
    testEmailTemplateFailure: (state) => ({
      ...state,
      testTemplateLoading: false
    }),
    deleteEmailTemplateLanguageStart: (state) => ({
      ...state,
      loading: true
    }),
    deleteEmailTemplateLanguageComplete: (state) => ({
      ...state,
      loading: false
    }),
    getEmailTypesStart: (state) => ({
      ...state,
      loading: true
    }),
    getEmailTypesSuccess: (state, { payload }) => ({
      ...state,
      loading: false,
      emailTypes: payload
    }),
    getEmailTypesFailure: (state) => ({
      ...state,
      loading: false
    })
  }
})

export default reducer

export {
  getAllemailTemplatesStart,
  getAllemailTemplatesComplete,
  getemailTemplateStart,
  getemailTemplateComplete,
  updateEmailTemplateStart,
  updateEmailTemplateComplete,
  createEmailTemplateComplete,
  createEmailTemplateStart,
  emailTemplateFailure,
  resetEmailTemplate,
  makePrimaryEmailTemplatesStart,
  makePrimaryEmailTemplatesComplete,
  getDynamicKeysStart,
  getDynamicKeysComplete,
  getImageGalleryStart,
  getImageGallerySuccess,
  getImageGalleryFailure,
  deleteFromGalleryStart,
  deleteFromGalleryComplete,
  testEmailTemplateStart,
  testEmailTemplateSuccess,
  testEmailTemplateFailure,
  deleteEmailTemplateLanguageStart,
  deleteEmailTemplateLanguageComplete,
  getEmailTypesStart,
  getEmailTypesSuccess,
  getEmailTypesFailure
}
