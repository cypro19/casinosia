import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getPlayerGameReportStart } from '../../../../store/redux-slices/dashboard'
import { getLoginToken } from '../../../../utils/storageUtils'
import { useParams } from 'react-router'

const useGameReport = () => {
  const dispatch = useDispatch()
  const { userId } = useParams()
  const { gameReportLoadingPlayer: loading, gameReportPlayer } = useSelector((state) => state.dashboard)
  const [selectedTab, setSelectedTab] = useState('game')
  const [dateOptions, setDateOptions] = useState('today')
  const [limit, setLimit] = useState(10)
  const [pageNo, setPageNo] = useState(1)

  const totalPages = Math.ceil(gameReportPlayer?.count / limit)

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const fetchDetails = () => {
    dispatch(getPlayerGameReportStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      dateOptions,
      selectedTab,
      userId,
      limit
    }))
  }

  useEffect(() => {
    fetchDetails()
  }, [state, limit])
  useEffect(() => {
    dispatch(getPlayerGameReportStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      dateOptions,
      selectedTab,
      userId,
      limit,
      clearData: true
    }))
  }, [selectedTab])

  useEffect(() => {
    if (dateOptions !== 'custom') fetchDetails()
  }, [dateOptions])

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/admin/get-game-report?userId=${userId}&limit=${limit}&dateOptions=${dateOptions}&customStartDate=${formatDateYMD(state.map(a => a.startDate))}&customEndDate=${formatDateYMD(state.map(a => a.endDate))}&tab=${selectedTab}&csvDownload=true&token=${getLoginToken()}`

  return {

    fetchDetails,
    loading,
    setState,
    state,
    selectedTab,
    setSelectedTab,
    gameReportPlayer,
    limit,
    setLimit,
    dateOptions,
    setDateOptions,
    getCsvDownloadUrl,
    totalPages,
    pageNo,
    setPageNo
  }
}

export default useGameReport
