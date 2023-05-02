import { takeLatest, put } from 'redux-saga/effects'
import { toast } from '../../components/Toast'
import { getSAdminWageringTemplateDetail } from '../../utils/apiCalls'
import { getWageringTemplateDetailFailure, getWageringTemplateDetailStart, getWageringTemplateDetailSuccess } from '../redux-slices/wageringTemplate'

export default function * wageringTemplateWatcher () {
  yield takeLatest(getWageringTemplateDetailStart.type, getWageringTemplateDetailWorker)
}

function * getWageringTemplateDetailWorker (action) {
  try {
    const { wageringTemplateId, limit, providerId, pageNo, search } = action && action.payload
    const { data } = yield getSAdminWageringTemplateDetail({ wageringTemplateId, limit, pageNo, providerId, search: search || '' })

    yield put(getWageringTemplateDetailSuccess(data?.data))
  } catch (e) {
    yield put(getWageringTemplateDetailFailure())
    yield toast(e.message, 'error')
  }
}
