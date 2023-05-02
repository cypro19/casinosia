import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoginToken } from '../../../../utils/storageUtils'
import { formatDateYMD, getDateDaysAgo } from '../../../../utils/dateFormatter'
import { getPlayerLiabilityStart } from '../../../../store/redux-slices/dashboard'
import useDidMountEffect from '../../../../utils/useDidMountEffect'

const usePlayerLiability = () => {
  const dispatch = useDispatch()
  const { playerLiablityLoading: loading, playerLiabilityData } = useSelector((state) => state.dashboard)
  const [dateOptions, setDateOptions] = useState('today')
  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(0),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const isInitialRender = useDidMountEffect()

  const loadPlayerLiabilities = () => {
    dispatch(getPlayerLiabilityStart({
      startDate: formatDateYMD(state.map(a => a.startDate)),
      endDate: formatDateYMD(state.map(a => a.endDate)),
      dateOptions
    }))
  }

  useEffect(() => {
    loadPlayerLiabilities()
  }, [state])
  useEffect(() => {
    if (dateOptions !== 'custom' && !isInitialRender) loadPlayerLiabilities()
  }, [dateOptions])

  const getCsvDownloadUrl = () =>
  `${process.env.REACT_APP_API_URL}/api/admin/get-players-liability?startDate=${formatDateYMD(state.map(a => a.startDate))}&endDate=${formatDateYMD(state.map(a => a.endDate))}&dateOptions=${dateOptions}&csvDownload=true&token=${getLoginToken()}`

  return {
    loadPlayerLiabilities,
    loading,
    setState,
    state,
    getCsvDownloadUrl,
    playerLiabilityData,
    dateOptions,
    setDateOptions
  }
}

export default usePlayerLiability
