import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoginToken } from '../../../../utils/storageUtils'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getKPISummaryStart } from '../../../../store/redux-slices/dashboard'

const useKPISummary = () => {
  const dispatch = useDispatch()
  const { kpiSummeryLoading: loading, KPISummary } = useSelector((state) => state.dashboard)
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const loadKPISummary = () => {
    dispatch(getKPISummaryStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate))
    }))
  }

  useEffect(() => {
    loadKPISummary()
  }, [state])

  const getCsvDownloadUrl = () =>
  `${process.env.REACT_APP_API_URL}/api/admin/get-kpi-summary?startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&csvDownload=true&token=${getLoginToken()}`

  return {
    loadKPISummary,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    KPISummary
  }
}

export default useKPISummary
