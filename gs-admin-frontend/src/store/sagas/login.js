import { takeLatest, put } from 'redux-saga/effects'
import { serialize } from 'object-to-formdata'
import {
  superAdminLogin,
  getAdminRole,
  getSAdminWallet,
  getLanguages,
  updateProfile,
  setEmailCreds,
  toggleStatus,
  setSiteConfig
} from '../../utils/apiCalls'
import {
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
  updateProfileStart,
  updateProfileComplete,
  setEmailCredsStart,
  setEmailCredsComplete,
  setSiteConfigurationStart,
  setSiteConfigurationComplete,
  updateLanguageStatusStart,
  updateLanguageStatusComplete,
  getActiveLanguagesSuccess,
  getActiveLanguagesFailure,
  getActiveLanguagesStart
} from '../redux-slices/login'
import { CommonRoutes, AdminRoutes } from '../../routes'
import { toast } from '../../components/Toast'
import {
  removeLoginToken,
  setItem,
  setLoginToken
} from '../../utils/storageUtils'

export default function * loginWatcher () {
  yield takeLatest(superAdminLoginStart.type, superAdminLoginWorker)
  yield takeLatest(getAdminRoleStart.type, getAdminRoleWorker)
  yield takeLatest(getSAdminWalletStart.type, getSAdminWalletWorker)
  yield takeLatest(getLanguagesStart.type, getLanguagesWorker)
  yield takeLatest(getActiveLanguagesStart.type, getActiveLanguagesWorker)
  yield takeLatest(updateProfileStart.type, updateProfileWorker)
  yield takeLatest(setEmailCredsStart.type, setEmailCredsWorker)
  yield takeLatest(setSiteConfigurationStart.type, setSiteConfigurationWorker)
  yield takeLatest(updateLanguageStatusStart.type, updateLanguageStatusWorker)
}

function * updateLanguageStatusWorker (action) {
  try {
    const { languageId, status, code, limit, pageNo } =
      action && action.payload

    yield toggleStatus({ languageId, status, code })

    yield put(updateLanguageStatusComplete())

    yield put(getLanguagesStart({ limit, pageNo, active: '' }))
    yield put(getActiveLanguagesStart({ limit, pageNo, active: true }))

    yield toast('Language Status Updated Successfully', 'success')
  } catch (e) {
    yield put(updateLanguageStatusComplete())

    yield toast(e.response.data.message, 'error')
  }
}

function * superAdminLoginWorker (action) {
  try {
    const { email, password, navigate } = action && action.payload

    const encryptedPass = Buffer.from(password).toString('base64')

    const { data } = yield superAdminLogin({ email, password: encryptedPass })

    const { accessToken } = data?.data

    setLoginToken(accessToken)
    setItem('role', 'Super Admin')

    yield put(superAdminLoginSuccess('Super Admin'))

    yield toast('Login Successfull', 'success')
    navigate(AdminRoutes.Dashboard)
  } catch (e) {
    if (e?.response?.status === 401) {
      yield put(superAdminLoginFailure(e?.response?.data?.message))

      yield toast(e?.response?.data?.message, 'error')
    } else {
      yield put(superAdminLoginFailure(e.message))

      yield toast(e.message, 'error')
    }
  }
}

function * getAdminRoleWorker () {
  try {
    const { data } = yield getAdminRole()

    yield put(getAdminRoleSuccess(data?.data?.roles))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAdminRoleFailure(e.response.data.message))
  }
}

function * getSAdminWalletWorker () {
  try {
    const { data } = yield getSAdminWallet()

    yield put(getSAdminWalletSuccess(data?.data?.wallet))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getSAdminWalletFailure(e.response.data.message))
  }
}

function * getLanguagesWorker (action) {
  try {
    const { limit, pageNo, active } = action && action.payload

    const { data } = yield getLanguages({ limit, pageNo, active })

    yield put(getLanguagesSuccess(data?.data?.languages))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')

    yield put(getLanguagesFailure(e?.response?.data?.message))
  }
}

function * getActiveLanguagesWorker (action) {
  try {
    const { limit, pageNo, active } = action && action.payload

    const { data } = yield getLanguages({ limit, pageNo, active })

    yield put(getActiveLanguagesSuccess(data?.data?.languages))
  } catch (e) {
    yield toast(e?.response?.data?.message, 'error')

    yield put(getActiveLanguagesFailure(e?.response?.data?.message))
  }
}

function * updateProfileWorker (action) {
  try {
    const { data } = action && action.payload
    yield updateProfile(data)

    yield put(updateProfileComplete())
    yield toast('Profile Updated Successfully', 'success')
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(updateProfileComplete())
  }
}

function * setEmailCredsWorker (action) {
  try {
    const { data } = action && action.payload
    yield setEmailCreds(data)

    yield put(setEmailCredsComplete())
    yield toast('Credentials Updated Successfully', 'success')
  } catch (e) {
    yield toast(e.response.data.message, 'error')
    yield put(setEmailCredsComplete())
  }
}

function * setSiteConfigurationWorker (action) {
  try {
    let { data, setEditable } = action && action.payload
    data = serialize(data)
    yield setSiteConfig(data)
    yield put(setSiteConfigurationComplete())
    setEditable(false)
    yield toast('Site Configuration Updated Successfully', 'success')
  } catch (e) {
    let { setEditable } = action && action.payload
    setEditable(false)
    yield toast(e.response.data.message, 'error')
    yield put(setSiteConfigurationComplete())
  }
}
