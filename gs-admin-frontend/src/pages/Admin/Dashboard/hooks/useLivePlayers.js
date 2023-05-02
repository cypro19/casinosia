import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLivePlayersReportStart } from '../../../../store/redux-slices/dashboard'

const useLivePlayers = () => {
  const dispatch = useDispatch()
  const { livePlayerloading: loading, livePlayerData } = useSelector((state) => state.dashboard)
  const [count, setCount] = useState(0)

  const fetchDetails = () => {
    dispatch(getLivePlayersReportStart())
  }

  useEffect(() => {
    fetchDetails()
  }, [])

  useEffect(() => {
    const intervals = setInterval(() => {
      clearInterval(intervals)
      fetchDetails()
      setCount(count + 1)
    }, 30000)
  }, [count])

  return {
    loading,
    livePlayerData,
    fetchDetails
  }
}

export default useLivePlayers
