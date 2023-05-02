import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getPlayerManagementStart } from '../../../../store/redux-slices/dashboard'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const useTopPlayers = () => {
  const dispatch = useDispatch()
  const { playerLoading: loading, playerData } = useSelector((state) => state.dashboard)
  const [selectedTab, setSelectedTab] = useState('winners')
  const [dateOptions, setDateOptions] = useState('today')
  const [limit, setLimit] = useState(10)

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const isInitialRender = useDidMountEffect()

  const fetchDetails = () => {
    dispatch(getPlayerManagementStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      limit,
      dateOptions
    }))
  }

  useEffect(() => {
    fetchDetails()
  }, [state, limit])

  useEffect(() => {
    if (dateOptions !== 'custom' && !isInitialRender) fetchDetails()
  }, [dateOptions])

  return {

    fetchDetails,
    loading,
    setState,
    state,
    selectedTab,
    setSelectedTab,
    playerData,
    limit,
    setLimit,
    dateOptions,
    setDateOptions
  }
}

export default useTopPlayers
