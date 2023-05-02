import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getBonusStart } from '../../../../../store/redux-slices/bonus'

const useEditBonus = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bonusId } = useParams()
  const [selectedTab, setSelectedTab] = useState('general')
  const { loading, bonusDetail } = useSelector((state) => state.bonus)
  const [state, setState] = useState([
    {
      startDate: bonusDetail ? bonusDetail?.validFrom : new Date(),
      endDate: bonusDetail ? bonusDetail?.validTo : new Date(),
      key: 'selection'
    }
  ])

  useEffect(() => {
    if (bonusId) {
      dispatch(getBonusStart({ bonusId }))
    }
  }, [bonusId])

  useEffect(() => {
    if (bonusDetail) {
      // setState({
      //   startDate: bonusDetail.validFrom,
      //   endDate: bonusDetail.validTo,
      //   key: 'selection'
      // })
      setState(([
        {
          startDate: bonusDetail ? new Date(bonusDetail?.validFrom) : new Date(),
          endDate: bonusDetail ? new Date(bonusDetail?.validTo) : new Date(),
          key: 'selection'
        }
      ]))
    }
  }, [bonusDetail])

  return {
    selectedTab,
    setSelectedTab,
    state,
    setState,
    dispatch,
    bonusDetail,
    loading,
    bonusId,
    navigate

  }
}

export default useEditBonus
