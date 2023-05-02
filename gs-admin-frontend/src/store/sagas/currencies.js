import { takeLatest, put } from 'redux-saga/effects'
import {
  getAllCurrencies,
  createCurrency,
  editCurrency,
  getCurrencyById
} from '../../utils/apiCalls'

import {
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
} from '../redux-slices/currencies'

import { toast } from '../../components/Toast'
import { AdminRoutes } from '../../routes'

export default function * currenciesWatcher () {
  yield takeLatest(getAllCurrenciesStart.type, getAllCurrenciesWorker)
  yield takeLatest(createCurrenciesStart.type, createCurrenciesWorker)
  yield takeLatest(editCurrencyStart.type, editCurrencyWorker)
  yield takeLatest(getCurrencyByIdStart.type, getCurrencyByIdWorker)
}

function * getAllCurrenciesWorker (action) {
  try {
    const { limit, pageNo } = action && action.payload

    const { data } = yield getAllCurrencies({
      limit,
      pageNo
    })

    yield put(getAllCurrenciesSuccess(data?.data?.currencies))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getAllCurrenciesFailure(e.response.data.message))
  }
}

function * createCurrenciesWorker (action) {
  try {
    const { name, code, exchangeRate, symbol, type, isPrimary, dailyLimit, loyaltyPoint, navigate } =
      action && action.payload

    yield createCurrency({ name, code, exchangeRate, symbol, type, isPrimary, dailyLimit, loyaltyPoint })

    yield put(createCurrenciesSuccess())

    yield toast('Currency Added Successfully', 'success')

    navigate(AdminRoutes.Currencies)
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(createCurrenciesFailure(e.response.data.message))
  }
}

function * editCurrencyWorker (action) {
  try {
    const {
      currencyId,
      name,
      exchangeRate,
      code,
      symbol,
      type,
      isPrimary,
      dailyLimit,
      loyaltyPoint,
      navigate
    } = action && action.payload

    yield editCurrency({
      currencyId,
      name,
      code,
      exchangeRate,
      symbol,
      type,
      dailyLimit,
      isPrimary,
      loyaltyPoint
    })

    yield put(editCurrencySuccess())

    yield toast('Currency Edited Successfully', 'success')

    navigate(AdminRoutes.Currencies)
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(editCurrencyFailure(e.response.data.message))
  }
}

function * getCurrencyByIdWorker (action) {
  try {
    const { currencyId } = action && action.payload

    const { data } = yield getCurrencyById(currencyId)

    yield put(getCurrencyByIdSuccess(data?.data?.currencyDetail))
  } catch (e) {
    yield toast(e.response.data.message, 'error')

    yield put(getCurrencyByIdFailure(e.response.data.message))
  }
}
