import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getGameReportStart } from '../../../../store/redux-slices/dashboard'
import { getLoginToken } from '../../../../utils/storageUtils'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useTopPlayers = () => {
  const dispatch = useDispatch()
  const { gameReportLoading: loading, gameReport } = useSelector((state) => state.dashboard)
  const [selectedTab, setSelectedTab] = useState('game')
  const [dateOptions, setDateOptions] = useState('today')
  const [limit, setLimit] = useState(10)
  const isInitialRender = useDidMountEffect()

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const fetchDetails = () => {
    dispatch(getGameReportStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      dateOptions,
      selectedTab
    }))
  }

  useEffect(() => {
    fetchDetails()
  }, [state, selectedTab])

  useEffect(() => {
    if (dateOptions !== 'custom' && !isInitialRender) fetchDetails()
  }, [dateOptions])

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/admin/get-game-report?dateOptions=${dateOptions}&customStartDate=${formatDateYMD(state.map(a => a.startDate))}&customEndDate=${formatDateYMD(state.map(a => a.endDate))}&tab=${selectedTab}&csvDownload=true&token=${getLoginToken()}`

  return {

    fetchDetails,
    loading,
    setState,
    state,
    selectedTab,
    setSelectedTab,
    gameReport,
    limit,
    setLimit,
    dateOptions,
    setDateOptions,
    getCsvDownloadUrl
  }
}

export default useTopPlayers
