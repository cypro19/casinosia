import { takeLatest, put } from 'redux-saga/effects'
import { getAllThemes, updateTheme, createTheme } from '../../utils/apiCalls'
import {
  getAllThemeStart,
  getAllThemeSuccess,
  getAllThemeFailure,
  updateThemeStart,
  updateThemeSuccess,
  updateThemeFailure,
  createThemeStart,
  createThemeSuccess,
  createThemeFailure
} from '../redux-slices/theme'
import { toast } from '../../components/Toast'
import { AdminRoutes } from '../../routes'

export default function * themeWatcher () {
  yield takeLatest(getAllThemeStart.type, getAllThemeWorker)
  yield takeLatest(updateThemeStart.type, updateThemeWorker)
  yield takeLatest(createThemeStart.type, createThemeWorker)
}
function * getAllThemeWorker (action) {
  try {
    const { limit, pageNo } = action && action.payload

    const { data } = yield getAllThemes({ limit, pageNo })

    yield put(getAllThemeSuccess(data?.data?.themes))
  } catch (e) {
    if (e?.response?.status === 401) {
      yield put(getAllThemeFailure(e?.response?.data?.message))

      yield toast(e?.response?.data?.message, 'error')
    } else {
      yield put(getAllThemeFailure(e.message))

      yield toast(e.message, 'error')
    }
  }
}

function * updateThemeWorker (action) {
  try {
    const { sTheme, navigate } = action && action.payload

    yield updateTheme(sTheme)

    yield put(updateThemeSuccess())

    yield toast('Theme updated Successfully', 'success')

    navigate(AdminRoutes.Themes)
  } catch (e) {
    yield put(updateThemeFailure(e?.response?.data?.message))
    yield toast(e?.response?.data?.message, 'error')
  }
}

function * createThemeWorker (action) {
  try {
    const { sTheme, navigate } = action && action.payload

    yield createTheme(sTheme)

    yield put(createThemeSuccess())

    yield toast('Theme created Successfully', 'success')

    navigate(AdminRoutes.Themes)
  } catch (e) {
    yield put(createThemeFailure(e?.response?.data?.message))
    yield toast(e?.response?.data?.message, 'error')
  }
}
