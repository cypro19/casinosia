import { takeLatest, put } from 'redux-saga/effects'
import {
  getEmailTemplates,
  getEmailTemplate,
  updateEmailTemplate,
  createEmailTemplate,
  primaryEmailTemplate,
  getImageGallery,
  deleteFromGallery,
  testEmailTemplateEndPoint,
  deleteEmailTemplateLanguage,
  getEmailTypes
} from '../../utils/apiCalls'
import {
  getAllemailTemplatesStart,
  getAllemailTemplatesComplete,
  getemailTemplateStart,
  getemailTemplateComplete,
  updateEmailTemplateStart,
  updateEmailTemplateComplete,
  createEmailTemplateStart,
  createEmailTemplateComplete,
  emailTemplateFailure,
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
} from '../redux-slices/emailTemplate'
import { toast } from '../../components/Toast'
import { emailDynamicOptions } from '../../pages/Admin/EmailTemplate/Constant'
import { AdminRoutes } from '../../routes'

export default function * EmailTemplateWatcher () {
  yield takeLatest(getAllemailTemplatesStart.type, getAllemailTemplatesWorker)
  yield takeLatest(getemailTemplateStart.type, getemailTemplateWorker)
  yield takeLatest(updateEmailTemplateStart.type, updateEmailTemplateWorker)
  yield takeLatest(createEmailTemplateStart.type, createEmailTemplateWorker)
  yield takeLatest(makePrimaryEmailTemplatesStart.type, primaryEmailTemplateWorker)
  yield takeLatest(getDynamicKeysStart.type, getDynamicKeysWorker)
  yield takeLatest(getImageGalleryStart.type, getImageGalleryWorker)
  yield takeLatest(deleteFromGalleryStart.type, deleteFromGalleryWorker)
  yield takeLatest(testEmailTemplateStart.type, testEmailTemplateWorker)
  yield takeLatest(deleteEmailTemplateLanguageStart.type, deleteEmailTemplateLanguageWorker)
  yield takeLatest(getEmailTypesStart.type, getEmailTypesWorker)
}

function * getAllemailTemplatesWorker (action) {
  try {
    const { data } = yield getEmailTemplates()
    yield put(getAllemailTemplatesComplete(data?.data))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(emailTemplateFailure())
  }
}

function * getDynamicKeysWorker (action) {
  try {
    const { type, emailTypes } = action && action.payload
    const data = yield emailDynamicOptions({ type, emailTypes })
    yield put(getDynamicKeysComplete(data))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(emailTemplateFailure())
  }
}

function * getemailTemplateWorker (action) {
  try {
    const { emailTemplateId } = action && action.payload

    const { data } = yield getEmailTemplate({ emailTemplateId })

    yield put(getemailTemplateComplete(data?.data?.emailTemplate))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(emailTemplateFailure())
  }
}

function * updateEmailTemplateWorker (action) {
  try {
    const { data, navigate } = action && action.payload
    yield updateEmailTemplate({ data })

    data?.create
      ? yield toast('Template Created Successfully', 'success')
      : yield toast('Template Updated Successfully', 'success')
    yield put(updateEmailTemplateComplete())
    yield put(getemailTemplateStart({ emailTemplateId: data?.emailTemplateId }))
    navigate(AdminRoutes.EmailTemplate)
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(emailTemplateFailure())
  }
}
function * primaryEmailTemplateWorker (action) {
  try {
    const { data } = action && action.payload
    yield primaryEmailTemplate({ data })

    yield toast('Template Marked As Primary Successfully', 'success')
    yield put(getAllemailTemplatesStart())
    yield put(makePrimaryEmailTemplatesComplete())
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(emailTemplateFailure())
  }
}

function * createEmailTemplateWorker (action) {
  try {
    const { data } = action && action.payload
    const res = yield createEmailTemplate({ data })

    yield toast('Template Created Successfully', 'success')
    yield put(createEmailTemplateComplete())
    yield put(getemailTemplateStart({ emailTemplateId: res?.data?.data?.emailTemplate?.emailTemplateId }))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(emailTemplateFailure())
  }
}

function * getImageGalleryWorker (action) {
  try {
    const { data } = yield getImageGallery()
    yield put(getImageGallerySuccess(data?.data?.gallery))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')
    yield put(getImageGalleryFailure())
  }
}

function * deleteFromGalleryWorker (action) {
  try {
    const { data } = action && action.payload
    yield deleteFromGallery({ data })
    yield put(deleteFromGalleryComplete())
    toast('Image Deleted Successfully', 'success')
    yield put(getImageGalleryStart())
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')
    yield put(deleteFromGalleryComplete())
  }
}

function * testEmailTemplateWorker (action) {
  try {
    const { data, setIsTestTemplateModalVisible, setTestEmail } = action && action.payload
    const res = yield testEmailTemplateEndPoint({ data })
    yield put(testEmailTemplateSuccess())
    setIsTestTemplateModalVisible(false)
    setTestEmail('')
    res?.data?.data?.emailSent?.success
      ? yield toast('Email Sent Successfully', 'success')
      : yield toast('Email Sending Unsuccessful', 'error')
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(testEmailTemplateFailure())
  }
}

function * deleteEmailTemplateLanguageWorker (action) {
  try {
    const { data } = action && action.payload

    yield deleteEmailTemplateLanguage({ data })

    yield put(deleteEmailTemplateLanguageComplete())

    yield toast('Email Template Deletion Successful', 'success')
    yield put(getemailTemplateStart({ emailTemplateId: data?.emailTemplateId }))
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(deleteEmailTemplateLanguageComplete())
  }
}

function * getEmailTypesWorker (action) {
  try {
    const { data } = yield getEmailTypes()
    yield put(getEmailTypesSuccess(data?.data))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')
    yield put(getEmailTypesFailure())
  }
}
