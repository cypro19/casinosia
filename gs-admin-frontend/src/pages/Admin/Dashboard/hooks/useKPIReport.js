import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoginToken } from '../../../../utils/storageUtils'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getKPIReportStart } from '../../../../store/redux-slices/dashboard'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useKPIReport = () => {
  const dispatch = useDispatch()
  const [dateOptions, setDateOptions] = useState('today')
  const [selectedTab, setSelectedTab] = useState('game')
  const { kpiReportLoading: loading, KPIReport } = useSelector((state) => state.dashboard)
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const isInitialRender = useDidMountEffect()

  const loadKPIReport = () => {
    dispatch(getKPIReportStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      dateOptions,
      selectedTab
    }))
  }

  useEffect(() => {
    loadKPIReport()
  }, [state, selectedTab])

  useEffect(() => {
    if (dateOptions !== 'custom' && !isInitialRender) loadKPIReport()
  }, [dateOptions])

  const getCsvDownloadUrl = () =>
  `${process.env.REACT_APP_API_URL}/api/admin/get-kpi-report?tab=${selectedTab}&dateOptions=${dateOptions}&customStartDate=${formatDateYMD(state.map(a => a.startDate))}&customEndDate=${formatDateYMD(state.map(a => a.endDate))}&csvDownload=true&token=${getLoginToken()}`

  return {
    loadKPIReport,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    KPIReport,
    dateOptions,
    setDateOptions,
    selectedTab,
    setSelectedTab
  }
}

export default useKPIReport
